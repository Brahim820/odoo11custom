odoo.define('testings.test', function (require) {
    "use strict";
    var screens = require('point_of_sale.screens');
    var PosBaseWidget = require('point_of_sale.BaseWidget');
    var core = require('web.core');
    var gui = require('point_of_sale.gui');
    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');

    var QWeb = core.qweb;
    var _t = core._t;
    var _super_orderline = models.Orderline.prototype;


    // models.load_models({
    //     model: 'table.chair',
    //     fields: ['name'],
    //     loaded: function(self,chair){
    //         console.log("trying to load chair");
    //         console.log(chair);
    //         // for(var i=0;i<chair.length;i++){
    //         //     // self.add_chair()
    //         // }
    //     }
    // });

    models.load_models({
        model: 'table.chair',
        fields: ['name'],
        loaded: function(self,chair){
            self.chair = chair;

        },
    });
    var customChair;
    var chair = screens.ProductScreenWidget.include({
        events: {
            'click span.chair_add':'add_chair',
            'click span.chair_remove' :'remove_chair',
            'click span.chair-button'  :'click_button',
        },save_changes: function(newChair,callback){
            var self   = this;
            var fields = _.find(this.pos.models,function(model){ return model.model === 'table.chair'; }).fields;
            // console.log(fields);
    
            // we need a serializable copy of the table, containing only the fields defined on the server
            var serializable_chair = {}
            for (var i = 0; i < fields.length; i++) {
                if (typeof newChair[fields[i]] !== 'undefined') {
                    serializable_chair[fields[i]] = newChair[fields[i]];
                }
            }
            // // and the id ...
            // serializable_chair.id = newChair['id'];
    
            rpc.query({
                    model: 'table.chair',
                    method: 'create_from_ui',
                    args: [serializable_chair],
                })
                .then(function (chair_id){
                    rpc.query({
                            model: 'table.chair',
                            method: 'search_read',
                            args: [[['id', '=', chair_id]], fields],
                            limit: 1,
                        })
                        .then(function (chair){
                            // self.customChair.push(chair[0]);
                            callback(chair);
                            // self.renderElement();
                        });
                }, function(type,err) {
                    self.gui.show_popup('error',{
                        'title':_t('Changes could not be saved'),
                        'body': _t('You must be connected to the internet to save your changes.'),
                    });
                });
        },trash: function(removeChair,callback){
            var self  = this;
            rpc.query({
                    model: 'table.chair',
                    method: 'create_from_ui',
                    args: [{'active':false,'id':removeChair.id}],
                })
                .then(function (chair_id){
                    // Removing all references from the table and the table_widget in in the UI ...
                    callback();
                }, function(type, err) {
                    self.gui.show_popup('error', {
                        'title':_t('Changes could not be saved'),
                        'body': _t('You must be connected to the internet to save your changes.'),
                    });
                });
        },init: function(parent, options) {
            var self = this;
            customChair = parent.pos.chair;
            return this._super(parent, options);

        },
        start: function(){ 
            var self = this;
            // console.log(this.order_widget);
            // console.log(customChair);
            for(var i=0;i<customChair.length;i++){
                self.add_chair(customChair[i]);
            }

            return this._super();  
        },
        add_chair:function (data) {
            const ref=this;
            if(data.name!=undefined){
                this.$('div.chair-list').append(QWeb.render('testing2',{widget:data}));
            }else{
                var seq=customChair.length+1;
                var cname="C"+seq
                var newchair = {
                    name:cname
                }
                this.save_changes(newchair,function(chair){
                    customChair.push(chair[0]);
                    ref.$('div.chair-list').append(QWeb.render('testing2',{widget:customChair[customChair.length-1]}));
                })
                
            }
            // orderline_change: function(line){
            
        },click_button:function(data){
            console.log('clicked :',data.toElement.innerText);
            var line = this.pos.get_order().get_selected_orderline();
            if(this.pos.get_order().get_last_orderline().order.selected_orderline.chair!=data.toElement.innerText){
                line.set_chair(data.toElement.innerText);
            
            }else{
                line.set_chair("")
            }
            // this.trigger('change',this);
            // this.screens.OrderWidget.orderline_change();
            // QWeb.render('OrderWidget');
            console.log(this.pos.get_order().get_last_orderline().order.selected_orderline);
        },
        remove_chair:function  (){
            const ref=this;
            if(customChair.length!=1){
                this.trash(customChair.pop(),function(){
                    ref.$('div.chair-list>span.chair-button').last().remove();
                });
            }
                
            
        },
        
    });


models.Orderline = models.Orderline.extend({
    initialize: function(attr, options) {
        _super_orderline.initialize.call(this,attr,options);
        this.chair = this.chair || "";
    },
    set_chair: function(chair){
        this.chair = chair;
        this.trigger('change',this);
    },
    get_chair: function(chair){
        return this.chair;
    },
    can_be_merged_with: function(orderline) {
        if (orderline.get_chair() !== this.get_chair()) {
            return false;
        } else {
            return _super_orderline.can_be_merged_with.apply(this,arguments);
        }
    },
    clone: function(){
        var orderline = _super_orderline.clone.call(this);
        orderline.chair = this.chair;
        return orderline;
    },
    export_as_JSON: function(){
        var json = _super_orderline.export_as_JSON.call(this);
        json.chair = this.chair;
        return json;
    },
    init_from_JSON: function(json){
        _super_orderline.init_from_JSON.apply(this,arguments);
        this.chair= json.chair;
    },
});

var OrderlineNoteButton = screens.ActionButtonWidget.extend({
    template: 'OrderlineNoteButton',
    button_click: function(){
        var line = this.pos.get_order().get_selected_orderline();
        if (line) {
            this.gui.show_popup('textarea',{
                title: _t('Add Note'),
                value:   line.get_note(),
                confirm: function(note) {
                    line.set_note(note);
                },
            });
        }
    },
});


    
    // var OderLineChair = screen.OrderWidget.extend({
    //     template:'OrderWidget',
    //     init: function(parent, options) {
    //         var self = this;
    //         this._super(parent,options);    
    //     },click_line:function(){
    //         console.log('hello sir');
    //    }
    // });
    });
    
    