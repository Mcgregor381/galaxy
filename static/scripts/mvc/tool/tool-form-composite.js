define(["utils/utils","utils/deferred","mvc/ui/ui-misc","mvc/form/form-view","mvc/form/form-data","mvc/tool/tool-form-base"],function(a,b,c,d,e,f){var g=Backbone.View.extend({initialize:function(a){this.model=a&&a.model||new Backbone.Model(a),this.deferred=new b,this.setElement($("<div/>").addClass("ui-form-composite").append(this.$message=$("<div/>")).append(this.$header=$("<div/>")).append(this.$parameters=$("<div/>")).append(this.$steps=$("<div/>")).append(this.$history=$("<div/>")).append(this.$execute=$("<div/>"))),$("body").append(this.$el),this._configure(),this.render()},_configure:function(){function b(a,b){var e=c._isWorkflowParameter(a);e&&b(c.wp_inputs[e]=c.wp_inputs[e]||{label:e,name:e,type:"text",color:"hsl( "+100*++d+", 70%, 30% )",style:"ui-form-wp-source",links:[]})}var c=this;this.forms=[],this.steps=[],this.links=[],this.parms=[],_.each(this.model.get("steps"),function(b,d){Galaxy.emit.debug("tool-form-composite::initialize()",d+" : Preparing workflow step."),b=a.merge({index:d,name:"Step "+(parseInt(d)+1)+": "+b.name,icon:"",help:null,description:b.annotation&&" - "+b.annotation||b.description,citations:null,collapsible:!0,collapsed:d>0&&!c._isDataStep(b),sustain_version:!0,sustain_repeats:!0,sustain_conditionals:!0,narrow:!0,text_enable:"Edit",text_disable:"Undo",cls_enable:"fa fa-edit",cls_disable:"fa fa-undo",errors:b.messages,initial_errors:!0},b),c.steps[d]=b,c.links[d]=[],c.parms[d]={}}),_.each(this.steps,function(a,b){e.visitInputs(a.inputs,function(a,d){c.parms[b][d]=a})}),_.each(this.steps,function(a,b){_.each(a.output_connections,function(a){_.each(c.steps,function(d){d.step_id===a.input_step_id&&c.links[b].push(d)})})}),_.each(this.steps,function(a,b){_.each(c.steps,function(d,e){var f={};_.each(a.output_connections,function(a){d.step_id===a.input_step_id&&(f[a.input_name]=a)}),_.each(c.parms[e],function(c,d){var e=f[d];e&&(c.type="hidden",c.help=c.step_linked?c.help+", ":"",c.help+="Output dataset '"+e.output_name+"' from step "+(parseInt(b)+1),c.step_linked=c.step_linked||[],c.step_linked.push(a))})})});var d=0;this.wp_inputs={},_.each(this.steps,function(a,d){_.each(c.parms[d],function(c){b(c.value,function(b){b.links.push(a),c.wp_linked=b.name,c.color=b.color,c.type="text",c.value=null,c.backdrop=!0,c.style="ui-form-wp-target"})}),_.each(a.post_job_actions,function(a){_.each(a.action_arguments,function(a){b(a,function(){})})})}),_.each(this.steps,function(b){if("tool"==b.step_type){var d=!0;e.visitInputs(b.inputs,function(e,f,g){var h=-1!=["data","data_collection"].indexOf(e.type),i=g[e.data_ref];e.step_linked&&!c._isDataStep(e.step_linked)&&(d=!1),e.options&&(0==e.options.length&&!d||e.wp_linked)&&(e.is_workflow=!0),i&&(e.is_workflow=i.step_linked&&!c._isDataStep(i.step_linked)||e.wp_linked),(h||e.value&&"RuntimeValue"==e.value.__class__&&!e.step_linked)&&(b.collapsed=!1),e.value&&"RuntimeValue"==e.value.__class__&&(e.value=null),e.flavor="workflow",h||"hidden"===e.type||e.wp_linked||(e.optional||!a.isEmpty(e.value)&&""!==e.value)&&(e.collapsible_value=e.value,e.collapsible_preview=!0)})}})},render:function(){var a=this;this.deferred.reset(),this._renderHeader(),this._renderMessage(),this._renderParameters(),this._renderHistory(),_.each(this.steps,function(b,c){a._renderStep(b,c)}),this.deferred.execute(function(){a._renderExecute()})},_renderHeader:function(){var a=this;this.$header.addClass("ui-form-header").empty().append(new c.Label({title:"Workflow: "+this.model.get("name")}).$el).append(new c.Button({title:"Collapse",icon:"fa-angle-double-up",onclick:function(){_.each(a.forms,function(a){a.portlet.collapse()})}}).$el).append(new c.Button({title:"Expand all",icon:"fa-angle-double-down",onclick:function(){_.each(a.forms,function(a){a.portlet.expand()})}}).$el)},_renderMessage:function(){this.$message.empty(),this.model.get("has_upgrade_messages")&&this.$message.append(new c.Message({message:"Some tools in this workflow may have changed since it was last saved or some errors were found. The workflow may still run, but any new options will have default values. Please review the messages below to make a decision about whether the changes will affect your analysis.",status:"warning",persistent:!0}).$el)},_renderParameters:function(){var a=this;this.wp_form=null,_.isEmpty(this.wp_inputs)||(this.wp_form=new d({title:"<b>Workflow Parameters</b>",inputs:this.wp_inputs,onchange:function(){_.each(a.wp_form.input_list,function(b){_.each(b.links,function(b){a._refreshStep(b)})})}}),this._append(this.$parameters.empty(),this.wp_form.$el))},_renderStep:function(b,c){var e=this,g=null,h=null;this.deferred.execute(function(i){h=i,"tool"==b.step_type?(g=new f(b),b.post_job_actions&&b.post_job_actions.length&&g.portlet.append($("<div/>").addClass("ui-form-element-disabled").append($("<div/>").addClass("ui-form-title").html("Job Post Actions")).append($("<div/>").addClass("ui-form-preview").html(_.reduce(b.post_job_actions,function(a,b){return a+" "+b.short_str},"")))),e._append(e.$steps,g.$el)):(_.each(b.inputs,function(a){a.flavor="module"}),g=new d(a.merge({title:"<b>"+b.name+"</b>",onchange:function(){_.each(e.links[c],function(a){e._refreshStep(a)})}},b)),e._append(e.$steps,g.$el)),e.forms[c]=g,e._refreshStep(b),Galaxy.emit.debug("tool-form-composite::initialize()",c+" : Workflow step state ready.",b),e._resolve(g.deferred,i)})},_resolve:function(a,b){var c=this;setTimeout(function(){a&&a.ready()||!a?b.resolve():c._resolve(a,b)},0)},_refreshStep:function(a){var b=this,c=this.forms[a.index];c&&(_.each(b.parms[a.index],function(a,d){if(a.step_linked||a.wp_linked){var e=c.field_list[c.data.match(d)];if(e){var f=void 0;if(a.step_linked)f={values:[]},_.each(a.step_linked,function(a){b._isDataStep(a)&&(value=b.forms[a.index].data.create().input,value&&_.each(value.values,function(a){f.values.push(a)}))}),!a.multiple&&f.values.length>0&&(f={values:[f.values[0]]});else if(a.wp_linked){var g=b.wp_form.field_list[b.wp_form.data.match(a.wp_linked)];g&&(f=g.value())}void 0!==f&&e.value(f)}}}),c.trigger("change"))},_renderHistory:function(){this.history_form=null,this.model.get("history_id")||(this.history_form=new d({inputs:[{type:"conditional",name:"new_history",test_param:{name:"check",label:"Send results to a new history",type:"boolean",value:"false",help:""},cases:[{value:"true",inputs:[{name:"name",label:"History name",type:"text",value:this.model.get("name")}]}]}]}),this._append(this.$history.empty(),this.history_form.$el))},_renderExecute:function(){var a=this;this.execute_btn=new c.Button({icon:"fa-check",title:"Run workflow",cls:"btn btn-primary",floating:"clear",onclick:function(){a._execute()}}),this._append(this.$execute.empty(),this.execute_btn.$el)},_execute:function(){var b=this,c={new_history_name:this.history_form.data.create()["new_history|name"],wf_parm:this.wp_form?this.wp_form.data.create():{},inputs:{}},d=!0;for(var e in this.forms){var f=this.forms[e],g=f.data.create(),h=b.steps[e],i=h.step_id;f.trigger("reset");for(var j in g){var k=g[j],l=f.data.match(j),m=(f.field_list[l],f.input_list[l]);if(!m.step_linked){if(d=this._isDataStep(h)?k&&k.values&&k.values.length>0:m.optional||m.is_workflow&&""!==k||!m.is_workflow&&null!==k,!d){f.highlight(l);break}c.inputs[i]=c.inputs[i]||{},c.inputs[i][j]=g[j]}}if(!d)break}d?(b._enabled(!1),Galaxy.emit.debug("tool-form-composite::submit()","Validation complete.",c),a.request({type:"POST",url:Galaxy.root+"api/workflows/"+this.workflow_id+"/invocations",data:c,success:function(a){Galaxy.emit.debug("tool-form-composite::submit","Submission successful.",a),b.$el.empty().append(b._templateSuccess(a)),parent.Galaxy&&parent.Galaxy.currHistoryPanel&&parent.Galaxy.currHistoryPanel.refreshContents()},error:function(a){if(Galaxy.emit.debug("tool-form-composite::submit","Submission failed.",a),a&&a.err_data)for(var d in b.forms){var e=b.forms[d],f=a.err_data[e.options.step_id];if(f){var g=e.data.matchResponse(f);for(var h in g){e.highlight(h,g[h]);break}}}else{var i=parent.Galaxy.modal;i&&i.show({title:"Job submission failed",body:b._templateError(a&&a.err_msg||c),buttons:{Close:function(){i.hide()}}})}},complete:function(){b._enabled(!0)}})):(b._enabled(!0),Galaxy.emit.debug("tool-form-composite::submit()","Validation failed.",c))},_append:function(a,b){a.append("<p/>").addClass("ui-margin-top").append(b)},_enabled:function(a){a?this.execute_btn.unwait():this.execute_btn.wait(),a?this.history_form.portlet.enable():this.history_form.portlet.disable(),_.each(this.forms,function(b){a?b.portlet.enable():b.portlet.disable()})},_isWorkflowParameter:function(b){return"$"===String(b).substring(0,1)?a.sanitize(b.substring(2,b.length-1)):void 0},_isDataStep:function(a){lst=$.isArray(a)?a:[a];for(var b=0;b<lst.length;b++){var c=lst[b];if(!c||!c.step_type||!c.step_type.startsWith("data"))return!1}return!0},_templateSuccess:function(a){if(a&&a.length>0){var b=$("<div/>").addClass("donemessagelarge").append($("<p/>").text("Successfully ran workflow '"+this.model.get("name")+"'. The following datasets have been added to the queue:"));for(var c in a){var d=a[c],e=$("<div/>").addClass("workflow-invocation-complete");d.history&&e.append($("<p/>").text("These datasets will appear in a new history: ").append($("<a/>").addClass("new-history-link").attr("data-history-id",d.history.id).attr("target","_top").attr("href","/history/switch_to_history?hist_id="+d.history.id).text(d.history.name))),_.each(d.outputs,function(a){e.append($("<div/>").addClass("messagerow").html("<b>"+a.hid+"</b>: "+a.name))}),b.append(e)}return b}return this._templateError(a)},_templateError:function(a){return $("<div/>").addClass("errormessagelarge").append($("<p/>").text("The server could not complete the request. Please contact the Galaxy Team if this error persists.")).append($("<pre/>").text(JSON.stringify(a,null,4)))}});return{View:g}});
//# sourceMappingURL=../../../maps/mvc/tool/tool-form-composite.js.map