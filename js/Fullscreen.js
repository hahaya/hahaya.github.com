/**
 * 全屏显示API兼容浏览器封装
 * 方法定义参考：https://github.com/martinaglv/jQuery-FullScreen/blob/master/fullscreen/jquery.fullscreen.js
 *
 * @name		Fullscreen
 * @author      linfei<clfsw0201@gmail.com>
 * @version 	1.0
 * @url			
 * @license		MIT License
 * @date        2012/6/6 
 *
 * 原理：
 *   element是要全屏显示的元素，fullscreen时：
 *     1. 给element添加.fullscreen
 *     2. 用一个空div包裹element，options.css中的定义用在这个div上，
 *        以便使这个div中的内容（即element）足够长时可以滚动显示
 *     3. 对这个div调用requestFullscreen()
 *
 * 应用示例：
 *   var fs = new Fullscreen( {
 *	 	element: $( '#fullscreenElementSelector' ),
 *      callback: function( isFullscreen ) {
 *			if ( isFullscreen ) {
 *				alert( '现在已经进入全屏模式' );
 *			}
 *			else {
 *				alert( '退出了全屏状态' );
 *			}
 *		}
 *	 } );
 *
 *   $( '#buttonToggleFullscreen' ).click( function(){
 *	 	fs.toggleFullscreen();
 *   } );
 *    
 *
 * 特别注意：
 *   1. win7下（其他windows未测），ESC退出全屏后会马上触发ESC的key事件
 *      mac下，ESC退出全屏，不会再出发ESC的键盘事件
 *      因此，如果需要监视ESC的键盘事件，一定要注意两个系统的区别
 *   2. 使用element.requestFullscreen()时，element在chrome中是任意的，
 *      哪怕element只是一个没有被添加到文档的 $("<div/>") 空元素；
 * 		但是在firefox中必须是要全屏显示的元素本身，否则不能全屏显示。
 *
 */
( function( $ ) {
	
	function Fullscreen( options ) {
		this.options = $.extend( true, {
				'element'    : $( 'body' ),
				'css'        : {
					'background' : '#000',
					'width'      : '100%',
					'height'     : '100%',
					'position'   : 'fixed',
					'top'        : 0,
					'left'       : 0,
					'z-index'    : 1000,
					'overflow' : 'auto'
				},
				'callback'   : $.noop,
				'noSafari'	 : false
			}, options );

		//必须要全屏输入时，将safari排除
		if ( this.options.noSafari && this._browser.safari ) {
			this.fullscreenEnabled = false;
		}

		this._initEvents();
	}

	$.extend( Fullscreen.prototype, {

		/**
		 * 执行全屏状态切换
		 */
		toggleFullscreen: function() {
			if ( !this.fullscreenEnabled ) {
				return;
			}

			if ( this.fullscreen() ) {
				this.exitFullscreen();
			}
			else {
				var wp = $( '<div/>' ).css( this.options.css ),
					el = this.options.element.addClass( 'fullscreen' );

				el.wrap( wp ); // 虽然wp包围el，但变量wp中的内容不会变，仍然是一个空的div

				// 下面参数在chrome下用 `wp.get(0)` 是正常的，但firefox不行
				this.requestFullscreen( el.parent().get( 0 ) );
			}
		},

		/**
		 * 注册事件，监视fullscreenchange
		 */
		_initEvents: function() {
			if ( !this.fullscreenEnabled ) {
				return;
			}
			var me = this,
				doc = $( document );

			doc.unbind( 'fullscreenchange webkitfullscreenchange mozfullscreenchange' )
				.bind(
					'fullscreenchange webkitfullscreenchange mozfullscreenchange',
					function( evt ) {
						if ( !me.fullscreen() ) {
							me.options.element.removeClass( 'fullscreen' ).unwrap();
						}
						me.options.callback.call( me, me.fullscreen() );
					}
				);
		},
		
		/**
		 * 判断浏览器类型
		 */
		_browser: ( function() {
			var ua = window.navigator.userAgent.toUpperCase(),
				v = {};

			v.chrome = /CHROME/.test( ua );
			v.safari = !v.chrome && /SAFARI/.test( ua );

			return v;
		} )(),

		/**
		 * 判断当前全屏状态
		 */
		fullscreen: function() {
			return document.fullscreen ||
				   document.webkitIsFullScreen ||
				   document.mozFullScreen ||
				   false;
		},

		/**
		 * W3 draft
		 * document.fullscreenElement
		 *     Returns the element that is displayed fullscreen,
		 *     or null if there is no such element.
		 *
		 * @return {DOM/null} 全屏显示的元素或是null
		 */
		fullscreenElement: function() {
			return document.fullscreenElement ||
				   document.webkitCurrentFullScreenElement ||
				   document.mozFullScreenElement ||
				   null;
		},

		/**
		 * W3 draft:
		 *     document.fullscreenEnabled
		 *     Returns true if document has the ability to display elements fullscreen,
		 *     or false otherwise.
		 */
		fullscreenEnabled: ( function() {
			var doc = document.documentElement;

			return	( 'requestFullscreen' in doc ) ||
					( 'webkitRequestFullScreen' in doc ) ||
					( 'mozRequestFullScreen' in doc && document.mozFullScreenEnabled ) ||
					false;
		} )(),

		/**
		 * W3 draft:
		 *     element.requestFullscreen()
		 *     Displays element fullscreen.
		 *
		 * @param {DOM} elem 要全屏显示的元素
		 */
		requestFullscreen: function( elem ) {
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			}
			else if (elem.webkitRequestFullScreen) {
				if ( this._browser.chrome ) {
					elem.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
				}
				else {
					elem.webkitRequestFullScreen();
				}
			}
			else if (elem.mozRequestFullScreen) {
				elem.mozRequestFullScreen();
			}
		},

		/**
		 * W3 draft:
		 *     document.exitFullscreen()
		 *	   Stops any elements within document from being displayed fullscreen.
		 */
		exitFullscreen: function() {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
			else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
			else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			}
		}
	} );

	window.Fullscreen = Fullscreen;

} )( jQuery );
