odoo.define('testing.test', function (require) {
    "use strict";
    var screens = require('point_of_sale.screens');
    var PosBaseWidget = require('point_of_sale.BaseWidget');
    var core = require('web.core');
    var gui = require('point_of_sale.gui');
    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');

    var QWeb = core.qweb;
    var _t = core._t;
    // console.log();
    // var _super_orderline = models.Orderline.prototype;


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

    // models.load_models({
    //     model: 'table.chair',
    //     fields: ['name'],
    //     loaded: function(self,chair){
    //         self.chair = chair;

    //     },
    // });
    // i start
    models.load_models({
        model: 'product.product',
        fields: ['qty_available','type','display_name'],
        loaded: function(self,allproduct){
            self.allproduct = allproduct;

        },
    });
    // var customChair;
    // i
    var customAllproduct;

    var newproduct = screens.ProductListWidget.include({
        init:function(parent, options){
            customAllproduct=parent.pos.allproduct;
            // console.log('customAllproduct',customAllproduct);
            var self = this;
            this._super(parent,options);
            // console.log('init',this.$('div.chair-list'));
            // console.log('screen.js options',options);
            // this.click_product_handler = function(){
            //     console.log('rewritten and should do noyhing');
            // };
            this.click_product_handler = function(){

                var product = self.pos.db.get_product_by_id(this.dataset.productId);
                
                // console.log($(this).find("span.stock-tag-available")[0]);
                // success 2
                
                // success 2
                if(product.qty_available<=0 && product.type=='product'){
                    
                    alert('out of stock');
                    
                    // console.log($(testnode2));
                    
                    // if($(testnode2)[0]){
                    //     console.log('testnode',$(testnode2)[0]);
                    //     $(testnode2)[0].style.display=none;
                    // }


                }
                else{
                    options.click_product_action(product);
                    product.qty_available=product.qty_available-1;
                    // jquery or js to real time update values
                    // console.log('find',product);
                    // $(this).find('span.stock-tag-available').innerText=product.qty_available;
                    var testnode2 = $(this).find("span.stock-tag-available")[0];
                    if($(testnode2)[0]){
                        // console.log('testnode',$(testnode2)[0].innerHTML);
                        $(testnode2)[0].innerHTML=product.qty_available;
                    }
                    // setting  color here
                    if(product.qty_available<=0 && product.type=='product'){
                        // better
                        var testnode2 = $(this).find("span.product")['context'];//not [0]
                        $(testnode2)[0].className='product setblur';
                        // done 
                        // $(testnode2)[0].style.background='red';
                        // var testnode2 = $(this).find("span.product")['context'];//not [0]
                        // $(testnode2)[0].style.opacity='0.3';
                    }

                    // jquery ends
                }
            };
        },
        renderElement: function() {
            var el_str  = QWeb.render(this.template, {widget: this});
            var el_node = document.createElement('div');
                el_node.innerHTML = el_str;
                el_node = el_node.childNodes[1];

            if(this.el && this.el.parentNode){
                this.el.parentNode.replaceChild(el_node,this.el);
            }

            // console.log('helo',this.$('div.chair-list'));
            this.el = el_node;
            // console.log('customAllproduct in render',customAllproduct[0].qty_available); 
            var list_container = el_node.querySelector('.product-list');
            
            //print random variable

            // console.log('last printed',Math.random());
            // console.log('gap');

            // console.log('product_list out render',this.product_list);
            // console.log('customAllproduct out render',customAllproduct);
            // console.log('already there',this.product_list[0]);
            // console.log('already there',this.product_list[0].qty_available);
            // if(this.product_list[0].qty_available==undefined){
            //     this.product_list[0].qty_available=1;
            //     console.log('if already there',this.product_list[0].qty_available);
            // }
            // else{
            //     this.product_list[0].qty_available=2;
            //     console.log('else already there',this.product_list[0].qty_available);
            // }
            for(var i = 0, len = this.product_list.length; i < len; i++){
                // console.log(this.customAllproduct[0].qty_available);

                // console.log('product_list in render',this.product_list[0].qty_available=customAllproduct[0].qty_available); 
                // // console.log('already there',this.product_list[i].qty_available);
                // adding quantity commented
                for(var j=0;j<customAllproduct.length;j++){
                    if(this.product_list[i].id==customAllproduct[j].id){
                        if(this.product_list[i].qty_available==undefined){
                            this.product_list[i].qty_available=customAllproduct[j].qty_available;
                            this.product_list[i].type=customAllproduct[j].type;
                        }
                        else{

                        }
                        
                    }
                }

                // console.log('product_list in render',this.product_list[i].qty_available);
                // console.log('customAllproduct in for render',customAllproduct[0].qty_available); 
            
                var product_node = this.render_product(this.product_list[i]);
                // success
                // var testnode = $(product_node).find("span.stock-tag-available")[0];
                // if($(testnode)[0]){
                //     // console.log('testnode',$(testnode)[0].innerHTML.trim());
                //     $(testnode)[0].innerHTML=10;
                // }    
                // success 
                    
                // console.log('sudhanshu',this.$('div.chair-list'));
                // console.log(this.product_list);
                
                //adding validate part hence commented 

                // if(!(this.product_list[i].qty_available<=0 && this.product_list[i].type=='product')){
                //     product_node.addEventListener('click',this.click_product_handler);
                // }
                product_node.addEventListener('click',this.click_product_handler);
                list_container.appendChild(product_node);
            }
        },
    });
    // model.load_fields('product.product',['qty_available']);
    // orderwidget
    
    // var neworderwidget = screens.OrderWidget.include({
        
    //     init: function(parent, options) {
    //         var self = this;
    //         this._super(parent,options);
    //         // console.log(this);
    //         // console.log('ProductListWidget',$(screens.ProductListWidget);
    //         // console.log('newproduct',newproduct);
    //         // this.newproduct.renderElement();
    //         // this.newproductvar = new newproduct(this,{});
    //         // console.log(newproductvar);
    //     },
    //     render_orderline: function(orderline){

    //         // this.myvar = new newproduct(this,{});
    //         // console.log(this.gui);
    //         // console.log(this.gui.screen_instances.products.renderElement());
    //         // console.log('in custom',orderline);
    //         // for(var k=0;k<orderline.length;k++){
    //             if(orderline.product.id==42||true){
    //                 console.log(orderline.get_quantity_str());
    //             }
    //             else{
    //                 // console.log('not');
    //             }
    //         // }
    //         var el_str  = QWeb.render('Orderline',{widget:this, line:orderline}); 
    //         var el_node = document.createElement('div');
    //             el_node.innerHTML = _.str.trim(el_str);
    //             el_node = el_node.childNodes[0];
    //             el_node.orderline = orderline;
    //             el_node.addEventListener('click',this.line_click_handler);
    //         var el_lot_icon = el_node.querySelector('.line-lot-icon');
    //         if(el_lot_icon){
    //             el_lot_icon.addEventListener('click', (function() {
    //                 this.show_product_lot(orderline);
    //             }.bind(this)));
    //         }

    //         orderline.node = el_node;
    //         return el_node;
    //     },


    // });

    var newnumpadwidget = screens.NumpadWidget.include({
        init: function(parent) {
            this._super(parent);
            this.state = new models.NumpadState();
        },
        start: function() {
            this.applyAccessRights();
            this.state.bind('change:mode', this.changedMode, this);
            this.pos.bind('change:cashier', this.applyAccessRights, this);
            this.changedMode();
            this.$el.find('.numpad-backspace').click(_.bind(this.clickDeleteLastChar, this));
            this.$el.find('.numpad-minus').click(_.bind(this.clickSwitchSign, this));
            this.$el.find('.number-char').click(_.bind(this.clickAppendNewChar, this));
            this.$el.find('.mode-button').click(_.bind(this.clickChangeMode, this));
        },
        clickDeleteLastChar: function() {
            // console.log('custom clicked');
            // do something
            return this.state.deleteLastChar();
        },
    });

    // var mynumpadwidget = models.NumpadState.include({
    //     deleteLastChar: function(){
    //         console.log('called newly');
    //     }
    // });


    return{
        newnumpadwidget: newnumpadwidget,
        newproduct: newproduct,
        
    };
});
    
    