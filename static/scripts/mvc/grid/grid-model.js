define([],function(){return Backbone.Model.extend({defaults:{url_base:"",async:!1,async_ops:[],categorical_filters:[],filters:{},sort_key:null,show_item_checkboxes:!1,advanced_search:!1,cur_page:1,num_pages:1,operation:void 0,item_ids:void 0},can_async_op:function(a){return-1!==_.indexOf(this.attributes.async_ops,a)},add_filter:function(a,b,c){if(c){var d,e=this.attributes.filters[a];if(null===e||void 0===e)d=b;else if("string"==typeof e)if("All"==e||e==b)d=b;else{var f=[];f[0]=e,f[1]=b,d=f}else d=e,-1===d.indexOf(b)&&d.push(b);this.attributes.filters[a]=d}else this.attributes.filters[a]=b},remove_filter:function(a,b){var c=this.attributes.filters[a];if(null===c||void 0===c)return!1;if("string"==typeof c)this.attributes.filters[a]="";else{var d=_.indexOf(c,b);-1!==d&&(c[d]="")}},get_url_data:function(){var a={async:this.attributes.async,sort:this.attributes.sort_key,page:this.attributes.cur_page,show_item_checkboxes:this.attributes.show_item_checkboxes,advanced_search:this.attributes.advanced_search};this.attributes.operation&&(a.operation=this.attributes.operation),this.attributes.item_ids&&(a.id=this.attributes.item_ids);var b=this;return _.each(_.pairs(b.attributes.filters),function(b){a["f-"+b[0]]=b[1]}),a},get_url:function(a){return this.get("url_base")+"?"+$.param(this.get_url_data())+"&"+$.param(a)}})});
//# sourceMappingURL=../../../maps/mvc/grid/grid-model.js.map