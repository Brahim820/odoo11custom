odoo.define('pos_chair_variant_mgmt.pos_chair_variant', function (require) {
    "use strict";
    var screens = require('point_of_sale.screens');
    var PosBaseWidget = require('point_of_sale.BaseWidget');
    var core = require('web.core');
    var gui = require('point_of_sale.gui');
    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');
    var db = require('point_of_sale.DB');
    var PopupWidget = require('point_of_sale.popups');

    var QWeb = core.qweb;
    var _t = core._t;
    var _super_orderline = models.Orderline.prototype;

    models.load_fields("pos.category", ['variant_ids', 'default_popup_for_varient', 'is_add_ons'])
    models.load_models({
        model: 'table.chair',
        fields: ['name'],
        loaded: function (self, chair) {
            self.chair = chair;
        },
    });
    models.load_models({
        model: 'pos.variants',
        fields: ['id', 'name'],
        loaded: function (self, variants) {
            self.variants = variants;
        },
    });
//
    var customChair;


    screens.OrderWidget.include({
        init: function (parent, options) {
            var self = this;
            this._super(parent, options);

        }, click_line: function (orderline, data) {
            this.$("span.chair-button:contains('" + data.toElement.innerText + "')").addClass('highlightc');
            this.pos.get_order().select_orderline(orderline);
            this.numpad_state.reset();
            if (orderline.chair) {
                $("span.chair-button").removeClass('highlightc');
                $("span.chair-button").filter(function () { return ($(this).text().indexOf(orderline.chair) > -1) }).addClass('highlightc');
            }
            else {
                $("span.chair-button").removeClass('highlightc');
            }
        },
    });

    var chair = screens.ProductScreenWidget.include({
        events: {
            'click span.chair_add': 'add_chair',
            'click span.chair_remove': 'remove_chair',
            'click span.chair-button': 'click_button',
            'click span.add_seperator': 'add_seperator',
        }, save_changes: function (newChair, callback) {
            var self = this;
            var fields = _.find(this.pos.models, function (model) { return model.model === 'table.chair'; }).fields;

            var serializable_chair = {}
            for (var i = 0; i < fields.length; i++) {
                if (typeof newChair[fields[i]] !== 'undefined') {
                    serializable_chair[fields[i]] = newChair[fields[i]];
                }
            }
            rpc.query({
                model: 'table.chair',
                method: 'create_from_ui',
                args: [serializable_chair],
            })
                .then(function (chair_id) {
                    rpc.query({
                        model: 'table.chair',
                        method: 'search_read',
                        args: [[['id', '=', chair_id]], fields],
                        limit: 1,
                    })
                        .then(function (chair) {
                            callback(chair);
                        });
                }, function (type, err) {
                    self.gui.show_popup('error', {
                        'title': _t('Changes could not be saved'),
                        'body': _t('You must be connected to the internet to save your changes.'),
                    });
                });
        }, trash: function (removeChair, callback) {
            var self = this;
            rpc.query({
                model: 'table.chair',
                method: 'create_from_ui',
                args: [{ 'active': false, 'id': removeChair.id }],
            })
                .then(function (chair_id) {
                    callback();
                }, function (type, err) {
                    self.gui.show_popup('error', {
                        'title': _t('Changes could not be saved'),
                        'body': _t('You must be connected to the internet to save your changes.'),
                    });
                });
        }, init: function (parent, options) {
            var self = this;
            customChair = parent.pos.chair;
            return this._super(parent, options);
        },
        start: function () {
            var self = this;
            for (var i = 0; i < customChair.length; i++) {
                self.add_chair(customChair[i]);
            }
            return this._super();
        },
        add_chair: function (data) {
            const ref = this;
            if (data.name != undefined) {
                this.$('div.chair-list').append(QWeb.render('ChairButton', { widget: data }));
            } else {
                var seq = customChair.length + 1;
                var cname = "C" + seq
                var newchair = {
                    name: cname
                }
                this.save_changes(newchair, function (chair) {
                    customChair.push(chair[0]);
                    ref.$('div.chair-list').append(QWeb.render('ChairButton', { widget: customChair[customChair.length - 1] }));
                })
            }
        }, click_button: function (data) {
            var line = this.pos.get_order().get_selected_orderline();
            if (line) {
                if (this.pos.get_order().get_last_orderline().order.selected_orderline.chair != data.toElement.innerText) {
                    line.set_chair(data.toElement.innerText);
                    this.$("span.chair-button").removeClass('highlightc');
                    this.$("span.chair-button:contains('" + data.toElement.innerText + "')").addClass('highlightc');
                } else {
                    line.set_chair("");
                    this.$("span.chair-button").removeClass('highlightc');
                    this.$("span.chair-button:contains('" + data.toElement.innerText + "')").removeClass('highlightc');
                }
            } else {
            }
        },
        remove_chair: function () {
            const ref = this;
            if (customChair.length != 1) {
                this.trash(customChair.pop(), function () {
                    ref.$('div.chair-list>span.chair-button').last().remove();
                });
            }
        }, add_seperator: function () {
            var line = this.pos.get_order().get_selected_orderline();
            if (line) {
                if (this.pos.get_order().get_last_orderline().order.selected_orderline.seperator) {
                    line.set_seperator(false);
                } else {
                    line.set_seperator(true);
                }
            }
          },
            click_product: function (product) {
              // var pqr = new screens.OrderWidget(this,{});
              // var myarr =[];
              //  myarr.push(this.pos.get_order().get_order_lines());
              //  myarr.push(product);
              // pqr.render_orderline(myarr);
            this.$("span.chair-button").removeClass('highlightc');

            // console.log(this.pos.get_order_list());
            // console.log(`this is list ${JSON.stringify(list)}`);
            console.log(this.pos.get_order());
            // this._super(product);
            var variants = this.pos.db.get_category_by_id(product.pos_categ_id[0]);
            console.log(product.pos_categ_id[0]);
            // lks starts
            if(variants && variants.hasOwnProperty('is_add_ons') && variants.is_add_ons) {
              console.log(`yes, this is addons `);
                  // lks ends
                  // this._super(product);
            }
            console.log("bye")

            if (variants) {
                if (variants.default_popup_for_varient) {
                    $('#variant').trigger('click');
                }
            }
        }, show_varient_popup: function (product, selected_variant) {
            var variants = this.pos.db.get_category_by_id(product.pos_categ_id[0]);
            var check = this.pos.variants;
            var list = [];
            if (variants) {
                var variant = variants.variant_ids
                for (var i = 0; i < variant.length; i++) {
                    for (var j = 0; j < check.length; j++) {
                        if (check[j].id == variant[i]) {
                            list.push({
                                'label': check[j].name,
                                'item': check[j].id,
                            })

                        }
                    }
                }
                this.gui.show_popup('varient', {
                    title: 'Add Varient',
                    list: list,
                    confirm: function (data) {
                        var row = this.$('div.var-select');
                        var line = this.pos.get_order().get_selected_orderline();
                        if (row.length > 0) {
                            console.log('length', row.length);
                            list = { id: [], name: [] }
                            for (var i = 0; i < row.length; i++) {
                                for (var j = 0; j < check.length; j++) {
                                    if (check[j].id == row[i].dataset.itemIndex) {
                                        list.id.push(parseInt(row[i].dataset.itemIndex))
                                        list.name.push(check[j].name)
                                    }
                                }
                            }
                            line.set_variant(list.name.join(','));
                            line.set_variantrel(list.id);
                        } else {
                            console.log('length', row.length);
                            this.gui.show_popup('error', {
                                title: _t('Please Select Variant'),
                                body: _t('You Need To Select Atleast One Variant'),
                            })
                        }
                    },
                    cancel: function () { console.log('canceled') },
                    is_selected: function (data) { },
                });
//
                if (selected_variant) {

                    var myDomElement = $('div.modal-dialog:not(div.oe_hidden)');
                    var myDomElement_filter = $(myDomElement).find('.selection');
                    var myDomElement_filter_filter = $(myDomElement_filter).find('.selection-item');
                    var all_variants = [];
                    for (var i = 0; i < myDomElement_filter_filter.length; i++) {
                        all_variants.push($(myDomElement_filter_filter[i]).data('item-index'));
                    }
                    for (var i = 0; i < selected_variant.length; i++) {
                        for (var j = 0; j < myDomElement_filter_filter.length; j++) {
                            if ($(myDomElement_filter_filter[j]).data('item-index') === selected_variant[i]) {
                                $(myDomElement_filter_filter[j]).trigger('click');
                            }
                        }

                    }
                }

            }


        }
    });

    var store_chair = [];
    var last_chairs;

    models.Orderline = models.Orderline.extend({
        initialize: function (attr, options) {
            _super_orderline.initialize.call(this, attr, options);
            this.chair = this.chair || "";
            this.seperator = this.seperator || false;
        },
        set_chair: function (chair) {
            this.chair = chair;
            this.trigger('change', this);
        },
        get_chair: function (chair) {
            return this.chair;
        },
        can_be_merged_with: function (orderline) {
            if (orderline.get_chair() !== this.get_chair()) {
                return false;
            } else {
                return _super_orderline.can_be_merged_with.apply(this, arguments);
            }
        },
        clone: function () {
            var orderline = _super_orderline.clone.call(this);
            orderline.chair = this.chair;
            orderline.seperator = this.seperator
            return orderline;
        },
        export_as_JSON: function () {
            var json = _super_orderline.export_as_JSON.call(this);
            json.chair = this.chair;
            json.seperator = this.seperator;
            if (this.variant_ids) {
                json.variant_ids = [[6, false, _.map(this.variant_ids)]];
            }
            store_chair.push(this.chair);
            last_chairs = store_chair[store_chair.length - 1];
            if (this.pos.get_order()) {
                if (last_chairs) {
                    for (var i = 0; i < store_chair.length; i++) {
                        $("span.chair-button:contains('" + store_chair[i] + "')").removeClass('highlightc');
                    }
                    $("span.chair-button:contains('" + last_chairs + "')").addClass("highlightc");
                }
                else {
                    $("span.chair-button:contains('" + this.chair + "')").removeClass('highlightc');
                }
            }
            else {
                $("span.chair-button:contains('" + this.chair + "')").removeClass('highlightc');
                $("span.chair-button:contains('" + last_chairs + "')").removeClass('highlightc');

            }
            return json;
        },
        init_from_JSON: function (json) {
            _super_orderline.init_from_JSON.apply(this, arguments);
            this.chair = json.chair;
            this.seperator = json.seperator;
            this.variant = json.variant;
            this.variant_ids = json.variant_ids;
        }, set_seperator: function (val) {
            this.seperator = val;
            this.trigger('change', this);
        },
        get_seperator: function (seperator) {
            return this.seperator;
        }, set_variant: function (val) {
            this.variant = val;
            this.trigger('change', this);
        }, get_variant: function (variant) {
            return this.variant;
        }, set_variantrel: function (val) {
            this.variant_ids = val;
            this.trigger('change', this);
        }, get_variantrel: function (variant_ids) {
            return this.variant_ids;
        }

    });

    var VarientPopup = PopupWidget.extend({
        template: 'VarientPopupWidget',
        show: function (options) {
            var self = this;
            options = options || {};
            this._super(options);
            this.list = options.list || [];
            this.is_selected = options.is_selected || function (item) { return false; };
            this.renderElement();
        },
        click_item: function (event) {
            if (this.options.confirm) {
                var item = this.list[parseInt($(event.target).data('item-index'))];
                if ($(event.target).hasClass('var-select')) {
                    $(event.target).removeClass('var-select');

                } else {
                    $(event.target).addClass('var-select');
                }
                item = item ? item.item : item;
            }
        }
    });

    gui.define_popup({ name: 'varient', widget: VarientPopup });


    var OrderlineVariantButton = screens.ActionButtonWidget.extend({
        template: 'OrderlineVariantButton',
        button_click: function () {
            var line = this.pos.get_order().get_selected_orderline();
            if (line) {
                this.gui.screen_instances.products.show_varient_popup(line.product, line.variant_ids);
            }
        },
    });
    // this.gui.screen_instances.OrderWidget.render_orderline(orderline);
    screens.define_action_button({
        'name': 'orderline_variant',
        'widget': OrderlineVariantButton,
        'condition': function () {
            return this.pos.config.iface_orderline_notes;
        },
    });

    


});
