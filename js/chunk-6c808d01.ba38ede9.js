(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6c808d01"],{"13b3":function(t,e,s){},"19fd":function(t,e,s){"use strict";var i=s("4825"),r=s.n(i);r.a},"1bfb":function(t,e,s){},4825:function(t,e,s){},"608c":function(t,e,s){},"7efd":function(t,e,s){"use strict";s.d(e,"a",(function(){return h}));s("608c");var i=s("9d26"),r=s("0789"),n=s("604c"),a=s("e4cd"),o=s("dc22"),l=s("c3f0"),c=s("58df");const h=Object(c["a"])(n["a"],a["a"]).extend({name:"base-slide-group",directives:{Resize:o["a"],Touch:l["a"]},props:{activeClass:{type:String,default:"v-slide-item--active"},centerActive:Boolean,nextIcon:{type:String,default:"$next"},prevIcon:{type:String,default:"$prev"},showArrows:{type:[Boolean,String],validator:t=>"boolean"===typeof t||["always","desktop","mobile"].includes(t)}},data:()=>({internalItemsLength:0,isOverflowing:!1,resizeTimeout:0,startX:0,scrollOffset:0,widths:{content:0,wrapper:0}}),computed:{__cachedNext(){return this.genTransition("next")},__cachedPrev(){return this.genTransition("prev")},classes(){return{...n["a"].options.computed.classes.call(this),"v-slide-group":!0,"v-slide-group--has-affixes":this.hasAffixes,"v-slide-group--is-overflowing":this.isOverflowing}},hasAffixes(){switch(this.showArrows){case"always":return!0;case"desktop":return!this.isMobile;case!0:return this.isOverflowing;case"mobile":return this.isMobile||this.isOverflowing;default:return!this.isMobile&&this.isOverflowing}},hasNext(){if(!this.hasAffixes)return!1;const{content:t,wrapper:e}=this.widths;return t>Math.abs(this.scrollOffset)+e},hasPrev(){return this.hasAffixes&&0!==this.scrollOffset}},watch:{internalValue:"setWidths",isOverflowing:"setWidths",scrollOffset(t){this.$refs.content.style.transform=`translateX(${-t}px)`}},beforeUpdate(){this.internalItemsLength=(this.$children||[]).length},updated(){this.internalItemsLength!==(this.$children||[]).length&&this.setWidths()},methods:{genNext(){const t=this.$scopedSlots.next?this.$scopedSlots.next({}):this.$slots.next||this.__cachedNext;return this.$createElement("div",{staticClass:"v-slide-group__next",class:{"v-slide-group__next--disabled":!this.hasNext},on:{click:()=>this.onAffixClick("next")},key:"next"},[t])},genContent(){return this.$createElement("div",{staticClass:"v-slide-group__content",ref:"content"},this.$slots.default)},genData(){return{class:this.classes,directives:[{name:"resize",value:this.onResize}]}},genIcon(t){let e=t;this.$vuetify.rtl&&"prev"===t?e="next":this.$vuetify.rtl&&"next"===t&&(e="prev");const s=`${t[0].toUpperCase()}${t.slice(1)}`,r=this["has"+s];return this.showArrows||r?this.$createElement(i["a"],{props:{disabled:!r}},this[e+"Icon"]):null},genPrev(){const t=this.$scopedSlots.prev?this.$scopedSlots.prev({}):this.$slots.prev||this.__cachedPrev;return this.$createElement("div",{staticClass:"v-slide-group__prev",class:{"v-slide-group__prev--disabled":!this.hasPrev},on:{click:()=>this.onAffixClick("prev")},key:"prev"},[t])},genTransition(t){return this.$createElement(r["d"],[this.genIcon(t)])},genWrapper(){return this.$createElement("div",{staticClass:"v-slide-group__wrapper",directives:[{name:"touch",value:{start:t=>this.overflowCheck(t,this.onTouchStart),move:t=>this.overflowCheck(t,this.onTouchMove),end:t=>this.overflowCheck(t,this.onTouchEnd)}}],ref:"wrapper"},[this.genContent()])},calculateNewOffset(t,e,s,i){const r=s?-1:1,n=r*i+("prev"===t?-1:1)*e.wrapper;return r*Math.max(Math.min(n,e.content-e.wrapper),0)},onAffixClick(t){this.$emit("click:"+t),this.scrollTo(t)},onResize(){this._isDestroyed||this.setWidths()},onTouchStart(t){const{content:e}=this.$refs;this.startX=this.scrollOffset+t.touchstartX,e.style.setProperty("transition","none"),e.style.setProperty("willChange","transform")},onTouchMove(t){this.scrollOffset=this.startX-t.touchmoveX},onTouchEnd(){const{content:t,wrapper:e}=this.$refs,s=t.clientWidth-e.clientWidth;t.style.setProperty("transition",null),t.style.setProperty("willChange",null),this.$vuetify.rtl?this.scrollOffset>0||!this.isOverflowing?this.scrollOffset=0:this.scrollOffset<=-s&&(this.scrollOffset=-s):this.scrollOffset<0||!this.isOverflowing?this.scrollOffset=0:this.scrollOffset>=s&&(this.scrollOffset=s)},overflowCheck(t,e){t.stopPropagation(),this.isOverflowing&&e(t)},scrollIntoView(){this.selectedItem&&(0===this.selectedIndex||!this.centerActive&&!this.isOverflowing?this.scrollOffset=0:this.centerActive?this.scrollOffset=this.calculateCenteredOffset(this.selectedItem.$el,this.widths,this.$vuetify.rtl):this.isOverflowing&&(this.scrollOffset=this.calculateUpdatedOffset(this.selectedItem.$el,this.widths,this.$vuetify.rtl,this.scrollOffset)))},calculateUpdatedOffset(t,e,s,i){const r=t.clientWidth,n=s?e.content-t.offsetLeft-r:t.offsetLeft;s&&(i=-i);const a=e.wrapper+i,o=r+n,l=.4*r;return n<=i?i=Math.max(n-l,0):a<=o&&(i=Math.min(i-(a-o-l),e.content-e.wrapper)),s?-i:i},calculateCenteredOffset(t,e,s){const{offsetLeft:i,clientWidth:r}=t;if(s){const t=e.content-i-r/2-e.wrapper/2;return-Math.min(e.content-e.wrapper,Math.max(0,t))}{const t=i+r/2-e.wrapper/2;return Math.min(e.content-e.wrapper,Math.max(0,t))}},scrollTo(t){this.scrollOffset=this.calculateNewOffset(t,{content:this.$refs.content?this.$refs.content.clientWidth:0,wrapper:this.$refs.wrapper?this.$refs.wrapper.clientWidth:0},this.$vuetify.rtl,this.scrollOffset)},setWidths(){window.requestAnimationFrame(()=>{const{content:t,wrapper:e}=this.$refs;this.widths={content:t?t.clientWidth:0,wrapper:e?e.clientWidth:0},this.isOverflowing=this.widths.wrapper<this.widths.content,this.scrollIntoView()})}},render(t){return t("div",this.genData(),[this.genPrev(),this.genWrapper(),this.genNext()])}});e["b"]=h.extend({name:"v-slide-group",provide(){return{slideGroup:this}}})},afdd:function(t,e,s){"use strict";var i=s("8336");e["a"]=i["a"]},b1ff:function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return t.loading||t._release?s("v-layout",{class:{"py-6":!t.isMobile},attrs:{column:""}},[s("card",t._b({staticClass:"mb-2",attrs:{release:t._release}},"card",{loading:t.loading},!1)),t.loading?t._e():s("v-tabs",{staticClass:"shrink mb-6",attrs:{"background-color":"transparent"},model:{value:t.tab,callback:function(e){t.tab=e},expression:"tab"}},[s("v-tab",[t._v("Эпизоды")]),s("v-tab",[t._v("Комментарии")])],1),t.component?s(t.component.is,t._g(t._b({tag:"component",class:{"pb-6":t.isMobile}},"component",t.component.props,!1),t.component.events)):t._e()],1):t._e()},r=[],n=(s("99af"),s("a9e3"),s("96cf"),s("1da1")),a=s("5530"),o=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-card",{attrs:{flat:"",color:"transparent"}},[t.loading?s("loader"):s("v-layout",{attrs:{column:""}},[s("v-row",{class:{"mb-4":!t.isMobile},attrs:{"no-gutters":"",align:"center"}},[s("v-col",{style:{maxWidth:t.isMobile?"100%":"240px"},attrs:{cols:t.isMobile?12:3}},[s("v-avatar",{class:{rounded:t.isMobile},attrs:{"max-height":"300",tile:t.isMobile,size:t.isMobile?"100%":"220"}},[s("v-img",{attrs:{"aspect-ratio":"1",src:t.poster,position:t.isMobile?"top center":"center center"}})],1)],1),s("v-col",{attrs:{cols:t.isMobile?12:9}},[s("div",[s("v-card-title",{staticClass:"text-h5 mb-2 font-weight-black",style:{wordBreak:"break-word"},domProps:{textContent:t._s(t.title)}}),s("v-card-subtitle",{staticClass:"pb-0",domProps:{textContent:t._s(t.original)}}),s("v-card-subtitle",{staticClass:"pt-0",domProps:{textContent:t._s(t.genres)}}),s("v-card-text",[s("favorite",t._b({staticClass:"mr-1",attrs:{color:"grey darken-3"}},"favorite",{release:t.release},!1)),t.year?s("v-chip",{staticClass:"mr-1",style:{height:"36px"},attrs:{label:"",color:"grey darken-3"},domProps:{textContent:t._s(t.year)}}):t._e(),t.type?s("v-chip",{staticClass:"mr-1",style:{height:"36px"},attrs:{label:"",color:"grey darken-3"},domProps:{textContent:t._s(t.type)}}):t._e()],1)],1)])],1),s("v-card-text",{staticClass:"white--text",domProps:{textContent:t._s(t.description)}})],1)],1)},l=[],c=(s("a15b"),function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"ma-4"},[s("v-layout",{attrs:{"align-center":""}},[s("v-skeleton-loader",{staticClass:"mr-8",attrs:{boilerplate:"",type:"avatar",height:"220",width:"220"}}),s("v-layout",{attrs:{column:""}},[s("v-skeleton-loader",{attrs:{boilerplate:"",type:"heading",height:"40",width:"70%"}}),s("v-skeleton-loader",{staticClass:"mt-5",attrs:{boilerplate:"",type:"text",width:"140"}}),s("v-skeleton-loader",{attrs:{boilerplate:"",type:"text",width:"260"}}),s("v-layout",{staticClass:"shrink mt-4"},[s("v-skeleton-loader",{staticClass:"mr-1",attrs:{boilerplate:"",type:"button",width:"65"}}),s("v-skeleton-loader",{staticClass:"mr-1",attrs:{boilerplate:"",type:"button",width:"65"}}),s("v-skeleton-loader",{attrs:{boilerplate:"",type:"button",width:"160"}})],1)],1)],1),s("v-skeleton-loader",{staticClass:"mt-6",attrs:{boilerplate:"",type:"text@10"}})],1)}),h=[],d=s("2877"),u=s("6544"),p=s.n(u),v=s("a722"),f=s("31292"),m={},g=Object(d["a"])(m,c,h,!1,null,null,null),b=g.exports;p()(g,{VLayout:v["a"],VSkeletonLoader:f["a"]});var w=b,x=s("b82e"),y=s("8d8d"),_={loading:{type:Boolean,default:!1},release:{type:Object,default:null}},$={props:_,mixins:[y["a"]],components:{Loader:w,Favorite:x["a"]},computed:{title:function(){return this.$__get(this.release,"names.ru")},original:function(){return this.$__get(this.release,"names.original")},genres:function(){return(this.$__get(this.release,"genres")||[]).join(" | ")},year:function(){return this.$__get(this.release,"year")},type:function(){return this.$__get(this.release,"type")},description:function(){return this.$__get(this.release,"description")},poster:function(){return this.$__get(this.release,"poster")}}},k=$,C=s("8212"),O=s("b0af"),I=s("99d9"),S=s("cc20"),B=s("62ad"),T=s("adda"),A=s("0fd9"),E=Object(d["a"])(k,o,l,!1,null,null,null),V=E.exports;p()(E,{VAvatar:C["a"],VCard:O["a"],VCardSubtitle:I["a"],VCardText:I["b"],VCardTitle:I["c"],VChip:S["a"],VCol:B["a"],VImg:T["a"],VLayout:v["a"],VRow:A["a"]});var j=V,R=s("11d0"),P=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-layout",{attrs:{column:""}},[!1===t.visible?s("v-skeleton-loader",{attrs:{type:"list-item-avatar-three-line@19"}}):t._e(),s("webview",t._b({ref:"comments",staticClass:"comments",class:{visible:t.visible},style:{height:t.height}},"webview",t.configuration,!1))],1)},M=[],N=s("9224"),z="(() => {\n  return {\n    width: document.getElementsByTagName('body')[0].clientWidth,\n    height: document.getElementsByTagName('body')[0].clientHeight,\n  }\n})();\n\n",W=":root {\n  --link-color: #bd636c !important;\n}\n\n\nhtml, body {\n  height: auto !important;\n  overflow: hidden !important;\n}\n\n.wcomments_page{\n  width: 100% !important;\n}\n\n.wcomments_head {\n  background: #1E1E1E !important;\n}\n\n.wcomments_form {\n  background: #313131 !important;\n  margin-bottom: 14px !important;\n  border: 0 !important;\n}\n\n#post_field {\n  background: transparent !important;\n  border-color: #1E1E1E !important;\n  color: white !important;\n}\n\ndiv#wcomments_export {\n  color: #868686 !important;\n}\n\n#page_wrap {\n  background: transparent !important;\n}\n\n.wall_post_text, .wall_reply_text {\n  color: #bdbdbd !important;\n}\n\n.reply_fakebox {\n  background: #121212 !important;\n  border-color: #404040 !important;\n}\n\n.reply_fakebox_wrap {\n  background: transparent !important;\n}\n\n.page_block {\n  background: #2f2f2f !important;\n  box-shadow: none !important;\n}\n\n.reply_highlighted {\n  background: #2f2f2f !important;\n}\n\n.post {\n  line-height: 20px !important;\n}\n\n.wr_header, ._wcomments_more {\n  background: #2f2f2f !important;\n  color: #a9a6a6 !important;\n}\n\n#send_post {\n  background: #191919 !important;\n}\n\n.addpost_button {\n  background: #333333 !important;\n}\n\n.reply_box {\n  background: #23232366 !important;\n  border: 0 !important;\n}\n\n.reply_form {\n  background-color: transparent !important;\n  border-color: #1E1E1E !important;\n  color: white !important;\n}\n\n.reply_field {\n  color: white !important;\n  background: transparent !important;\n  border-color: #636262 !important;\n}\n\n.submit_post {\n  background: transparent !important;\n}\n",L={release:{type:Object,default:null}},F={props:L,data:function(){return{width:"100%",height:"100%",visible:!1,interval:null}},computed:{anilibria:function(){return N["meta"].links.anilibria},configuration:function(){return{src:this.src,partition:"release:comments",allowpopups:!0,httpreferrer:this.anilibria,disablewebsecurity:!0}},src:function(){var t=this.$__get(this.release,"code"),e="".concat(this.anilibria,"/release/").concat(t,".html"),s="5315207";return"https://vk.com/widget_comments.php?app=".concat(s,"&url=").concat(e,"&limit=10")}},mounted:function(){var t=this,e=this.$refs.comments;e.addEventListener("did-navigate",(function(){return t.visible=!1})),e.addEventListener("certificate-error",(function(){return t.$toasted.error("Произошла ошибка при загрузке комментариев. Ошибка с сертификатом")})),e.addEventListener("did-fail-load",(function(){return t.$toasted.error("Произошла ошибка при загрузке комментариев")})),e.addEventListener("dom-ready",(function(){t.visible=!1,e.insertCSS(W),t.interval&&clearInterval(t.interval),t.interval=setInterval((function(){e.executeJavaScript(z).then((function(e){var s=e.width,i=e.height;t.width=s+"px",t.height=i+"px"}))}),50),setTimeout((function(){return t.visible=!0}),1e3)}))},beforeDestroy:function(){this.interval&&clearInterval(this.interval)}},D=F,H=(s("19fd"),Object(d["a"])(D,P,M,!1,null,null,null)),X=H.exports;p()(H,{VLayout:v["a"],VSkeletonLoader:f["a"]});var q=X,U=s("2f62"),J={release_id:{type:[String,Number],default:null}},G={props:J,name:"Release.View",meta:function(){return{title:this._release?"Релиз: ".concat(this._release.names.ru," — ").concat(this._release.names.original):"Anilibrix: загрузка релиза ".concat(this.release_id)}},mixins:[y["a"]],components:{Card:j,Episodes:R["a"],Comments:q},data:function(){return{tab:0,loading:!1}},computed:Object(a["a"])(Object(a["a"])({},Object(U["d"])("release",{_release:function(t){return t.data}})),{},{episodes:function(){return this.$__get(this._release,"episodes")||[]},components:function(){var t=this;return[{is:R["a"],props:{loading:this.loading,release:this._release,episodes:this.episodes},events:{episode:function(e){return toVideo(t._release,e)}}},{is:q,props:{release:this._release}}]},component:function(){return this.components[this.tab]||null}}),methods:Object(a["a"])({},Object(U["b"])("release",{_getRelease:"getRelease"})),watch:{release_id:{immediate:!0,handler:function(t){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function s(){var i;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:if(i=document.getElementById("container"),i&&i.scrollTo(0,0),null!==e._release&&e._release.id===parseInt(t)){s.next=8;break}return e.loading=!0,s.next=6,e._getRelease(t);case 6:e.loading=!1,e.$visit(e.$route.path,e.$metaInfo.title);case 8:case"end":return s.stop()}}),s)})))()}}}},K=G,Q=s("4e82"),Y=s("1c87"),Z=s("7560"),tt=s("80d2"),et=s("58df");const st=Object(et["a"])(Y["a"],Object(Q["a"])("tabsBar"),Z["a"]);var it=st.extend().extend().extend({name:"v-tab",props:{ripple:{type:[Boolean,Object],default:!0}},data:()=>({proxyClass:"v-tab--active"}),computed:{classes(){return{"v-tab":!0,...Y["a"].options.computed.classes.call(this),"v-tab--disabled":this.disabled,...this.groupClasses}},value(){let t=this.to||this.href||"";if(this.$router&&this.to===Object(this.to)){const e=this.$router.resolve(this.to,this.$route,this.append);t=e.href}return t.replace("#","")}},mounted(){this.onRouteChange()},methods:{click(t){this.href&&this.href.indexOf("#")>-1&&t.preventDefault(),t.detail&&this.$el.blur(),this.$emit("click",t),this.to||this.toggle()}},render(t){const{tag:e,data:s}=this.generateRouteLink();return s.attrs={...s.attrs,"aria-selected":String(this.isActive),role:"tab",tabindex:0},s.on={...s.on,keydown:t=>{t.keyCode===tt["s"].enter&&this.click(t),this.$emit("keydown",t)}},t(e,s,this.$slots.default)}}),rt=(s("1bfb"),s("7efd")),nt=s("d10f"),at=Object(et["a"])(rt["a"],nt["a"],Z["a"]).extend({name:"v-tabs-bar",provide(){return{tabsBar:this}},computed:{classes(){return{...rt["a"].options.computed.classes.call(this),"v-tabs-bar":!0,"v-tabs-bar--is-mobile":this.isMobile,"v-tabs-bar--show-arrows":this.showArrows,...this.themeClasses}}},watch:{items:"callSlider",internalValue:"callSlider",$route:"onRouteChange"},methods:{callSlider(){this.isBooted&&this.$emit("call:slider")},genContent(){const t=rt["a"].options.methods.genContent.call(this);return t.data=t.data||{},t.data.staticClass+=" v-tabs-bar__content",t},onRouteChange(t,e){if(this.mandatory)return;const s=this.items,i=t.path,r=e.path;let n=!1,a=!1;for(const o of s)if(o.to===i?n=!0:o.to===r&&(a=!0),n&&a)break;!n&&a&&(this.internalValue=void 0)}},render(t){const e=rt["a"].options.render.call(this,t);return e.data.attrs={role:"tablist"},e}}),ot=(s("13b3"),s("c3f0")),lt=s("afdd"),ct=s("9d26"),ht=s("604c"),dt=ht["a"].extend({name:"v-window",provide(){return{windowGroup:this}},directives:{Touch:ot["a"]},props:{activeClass:{type:String,default:"v-window-item--active"},continuous:Boolean,mandatory:{type:Boolean,default:!0},nextIcon:{type:[Boolean,String],default:"$next"},prevIcon:{type:[Boolean,String],default:"$prev"},reverse:{type:Boolean,default:void 0},showArrows:Boolean,showArrowsOnHover:Boolean,touch:Object,touchless:Boolean,value:{required:!1},vertical:Boolean},data(){return{changedByDelimiters:!1,internalHeight:void 0,transitionHeight:void 0,transitionCount:0,isBooted:!1,isReverse:!1}},computed:{isActive(){return this.transitionCount>0},classes(){return{...ht["a"].options.computed.classes.call(this),"v-window--show-arrows-on-hover":this.showArrowsOnHover}},computedTransition(){if(!this.isBooted)return"";const t=this.vertical?"y":"x",e=this.$vuetify.rtl&&"x"===t?!this.internalReverse:this.internalReverse,s=e?"-reverse":"";return`v-window-${t}${s}-transition`},hasActiveItems(){return Boolean(this.items.find(t=>!t.disabled))},hasNext(){return this.continuous||this.internalIndex<this.items.length-1},hasPrev(){return this.continuous||this.internalIndex>0},internalIndex(){return this.items.findIndex((t,e)=>this.internalValue===this.getValue(t,e))},internalReverse(){return this.reverse?!this.isReverse:this.isReverse}},watch:{internalIndex:"updateReverse"},mounted(){window.requestAnimationFrame(()=>this.isBooted=!0)},methods:{genContainer(){const t=[this.$slots.default];return this.showArrows&&t.push(this.genControlIcons()),this.$createElement("div",{staticClass:"v-window__container",class:{"v-window__container--is-active":this.isActive},style:{height:this.internalHeight||this.transitionHeight}},t)},genIcon(t,e,s){return this.$createElement("div",{staticClass:"v-window__"+t},[this.$createElement(lt["a"],{props:{icon:!0},attrs:{"aria-label":this.$vuetify.lang.t("$vuetify.carousel."+t)},on:{click:()=>{this.changedByDelimiters=!0,s()}}},[this.$createElement(ct["a"],{props:{large:!0}},e)])])},genControlIcons(){const t=[],e=this.$vuetify.rtl?this.nextIcon:this.prevIcon;if(this.hasPrev&&e&&"string"===typeof e){const s=this.genIcon("prev",e,this.prev);s&&t.push(s)}const s=this.$vuetify.rtl?this.prevIcon:this.nextIcon;if(this.hasNext&&s&&"string"===typeof s){const e=this.genIcon("next",s,this.next);e&&t.push(e)}return t},getNextIndex(t){const e=(t+1)%this.items.length,s=this.items[e];return s.disabled?this.getNextIndex(e):e},getPrevIndex(t){const e=(t+this.items.length-1)%this.items.length,s=this.items[e];return s.disabled?this.getPrevIndex(e):e},next(){if(this.isReverse=this.$vuetify.rtl,!this.hasActiveItems||!this.hasNext)return;const t=this.getNextIndex(this.internalIndex),e=this.items[t];this.internalValue=this.getValue(e,t)},prev(){if(this.isReverse=!this.$vuetify.rtl,!this.hasActiveItems||!this.hasPrev)return;const t=this.getPrevIndex(this.internalIndex),e=this.items[t];this.internalValue=this.getValue(e,t)},updateReverse(t,e){this.changedByDelimiters?this.changedByDelimiters=!1:this.isReverse=t<e}},render(t){const e={staticClass:"v-window",class:this.classes,directives:[]};if(!this.touchless){const t=this.touch||{left:()=>{this.$vuetify.rtl?this.prev():this.next()},right:()=>{this.$vuetify.rtl?this.next():this.prev()},end:t=>{t.stopPropagation()},start:t=>{t.stopPropagation()}};e.directives.push({name:"touch",value:t})}return t("div",e,[this.genContainer()])}}),ut=dt.extend({name:"v-tabs-items",props:{mandatory:{type:Boolean,default:!1}},computed:{classes(){return{...dt.options.computed.classes.call(this),"v-tabs-items":!0}},isDark(){return this.rootIsDark}},methods:{getValue(t,e){return t.id||ht["a"].options.methods.getValue.call(this,t,e)}}}),pt=s("a9ad"),vt=Object(et["a"])(pt["a"]).extend({name:"v-tabs-slider",render(t){return t("div",this.setBackgroundColor(this.color,{staticClass:"v-tabs-slider"}))}}),ft=s("a452"),mt=s("dc22");const gt=Object(et["a"])(pt["a"],ft["a"],Z["a"]);var bt=gt.extend().extend({name:"v-tabs",directives:{Resize:mt["a"]},props:{activeClass:{type:String,default:""},alignWithTitle:Boolean,backgroundColor:String,centerActive:Boolean,centered:Boolean,fixedTabs:Boolean,grow:Boolean,height:{type:[Number,String],default:void 0},hideSlider:Boolean,iconsAndText:Boolean,mobileBreakpoint:[String,Number],nextIcon:{type:String,default:"$next"},optional:Boolean,prevIcon:{type:String,default:"$prev"},right:Boolean,showArrows:[Boolean,String],sliderColor:String,sliderSize:{type:[Number,String],default:2},vertical:Boolean},data(){return{resizeTimeout:0,slider:{height:null,left:null,right:null,top:null,width:null},transitionTime:300}},computed:{classes(){return{"v-tabs--align-with-title":this.alignWithTitle,"v-tabs--centered":this.centered,"v-tabs--fixed-tabs":this.fixedTabs,"v-tabs--grow":this.grow,"v-tabs--icons-and-text":this.iconsAndText,"v-tabs--right":this.right,"v-tabs--vertical":this.vertical,...this.themeClasses}},isReversed(){return this.$vuetify.rtl&&this.vertical},sliderStyles(){return{height:Object(tt["f"])(this.slider.height),left:this.isReversed?void 0:Object(tt["f"])(this.slider.left),right:this.isReversed?Object(tt["f"])(this.slider.right):void 0,top:this.vertical?Object(tt["f"])(this.slider.top):void 0,transition:null!=this.slider.left?null:"none",width:Object(tt["f"])(this.slider.width)}},computedColor(){return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"}},watch:{alignWithTitle:"callSlider",centered:"callSlider",centerActive:"callSlider",fixedTabs:"callSlider",grow:"callSlider",right:"callSlider",showArrows:"callSlider",vertical:"callSlider","$vuetify.application.left":"onResize","$vuetify.application.right":"onResize","$vuetify.rtl":"onResize"},mounted(){this.$nextTick(()=>{window.setTimeout(this.callSlider,30)})},methods:{callSlider(){return!this.hideSlider&&this.$refs.items&&this.$refs.items.selectedItems.length?(this.$nextTick(()=>{const t=this.$refs.items.selectedItems[0];if(!t||!t.$el)return this.slider.width=0,void(this.slider.left=0);const e=t.$el;this.slider={height:this.vertical?e.scrollHeight:Number(this.sliderSize),left:this.vertical?0:e.offsetLeft,right:this.vertical?0:e.offsetLeft+e.offsetWidth,top:e.offsetTop,width:this.vertical?Number(this.sliderSize):e.scrollWidth}}),!0):(this.slider.width=0,!1)},genBar(t,e){const s={style:{height:Object(tt["f"])(this.height)},props:{activeClass:this.activeClass,centerActive:this.centerActive,dark:this.dark,light:this.light,mandatory:!this.optional,mobileBreakpoint:this.mobileBreakpoint,nextIcon:this.nextIcon,prevIcon:this.prevIcon,showArrows:this.showArrows,value:this.internalValue},on:{"call:slider":this.callSlider,change:t=>{this.internalValue=t}},ref:"items"};return this.setTextColor(this.computedColor,s),this.setBackgroundColor(this.backgroundColor,s),this.$createElement(at,s,[this.genSlider(e),t])},genItems(t,e){return t||(e.length?this.$createElement(ut,{props:{value:this.internalValue},on:{change:t=>{this.internalValue=t}}},e):null)},genSlider(t){return this.hideSlider?null:(t||(t=this.$createElement(vt,{props:{color:this.sliderColor}})),this.$createElement("div",{staticClass:"v-tabs-slider-wrapper",style:this.sliderStyles},[t]))},onResize(){this._isDestroyed||(clearTimeout(this.resizeTimeout),this.resizeTimeout=window.setTimeout(this.callSlider,0))},parseNodes(){let t=null,e=null;const s=[],i=[],r=this.$slots.default||[],n=r.length;for(let a=0;a<n;a++){const n=r[a];if(n.componentOptions)switch(n.componentOptions.Ctor.options.name){case"v-tabs-slider":e=n;break;case"v-tabs-items":t=n;break;case"v-tab-item":s.push(n);break;default:i.push(n)}else i.push(n)}return{tab:i,slider:e,items:t,item:s}}},render(t){const{tab:e,slider:s,items:i,item:r}=this.parseNodes();return t("div",{staticClass:"v-tabs",class:this.classes,directives:[{name:"resize",modifiers:{quiet:!0},value:this.onResize}]},[this.genBar(e,s),this.genItems(i,r)])}}),wt=Object(d["a"])(K,i,r,!1,null,null,null),xt=wt.exports;p()(wt,{VLayout:v["a"],VTab:it,VTabs:bt});e["default"]=xt},b82e:function(t,e,s){"use strict";var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return t._isAuthorized?s("v-btn",{attrs:{color:t.isInFavorite?"secondary":t.color,loading:t._loading},on:{click:function(e){e.stopPropagation(),t.isInFavorite?t._removeFromFavorites(t.release):t._addToFavorites(t.release)}}},[t.isInFavorite?s("v-icon",[t._v("mdi-star")]):s("v-icon",[t._v("mdi-star-outline")])],1):t._e()},r=[],n=s("5530"),a=s("2f62"),o={release:{type:Object,default:null},color:{type:String,default:null}},l={props:o,computed:Object(n["a"])(Object(n["a"])(Object(n["a"])({},Object(a["d"])("favorites",{_loading:function(t){return t.loading}})),Object(a["c"])("app/account",{_isAuthorized:"isAuthorized"})),{},{isInFavorite:function(){return this.$store.getters["favorites/isInFavorite"](this.release)}}),methods:Object(n["a"])({},Object(a["b"])("favorites",{_addToFavorites:"addToFavorites",_removeFromFavorites:"removeFromFavorites"}))},c=l,h=s("2877"),d=s("6544"),u=s.n(d),p=s("8336"),v=s("132d"),f=Object(h["a"])(c,i,r,!1,null,null,null),m=f.exports;u()(f,{VBtn:p["a"],VIcon:v["a"]});e["a"]=m}}]);
//# sourceMappingURL=chunk-6c808d01.ba38ede9.js.map