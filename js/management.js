$(document).ready(
	function(){

		var gapTime = 300;
		var lastTime = null;
		var nowTime = null;
		var outlineClick = false;//大纲点击控制

		$('.catalog_btn').on("click", function(){
			$('.float_catalog').removeClass('float_out').removeClass('fadeOutLeft').addClass('box_shadow').addClass('fadeInLeft');
		});
		$('.catalog_hide').on("click", function(){
			$('.float_catalog').removeClass('fadeInLeft').removeClass('box_shadow').addClass('float_out');
			$('#thumbClickMenuDIV').hide();
			return false;
		});

		$('.index_right_view,.column_content').click(function(){
    		$('.float_catalog').removeClass('fadeInLeft').removeClass('box_shadow').addClass('float_out')
    		$('#thumbClickMenuDIV').hide()
		});

		$('.left_fix').hide();
		$('.topic_comment').hide();
		$('.topic_login_box').hide();
		$('.comment_view').hide();

		$('.nav_column_title').removeAttr("href");

		$('.catelog_item').each(function(){
            $(this).removeAttr("onclick");
			$(this).click(function() {
                var path = $(this).children("span").text()+'.'+$(this).children("div").children("div").text()+'.html';
				$(window).attr('location', path.replace(/[/\\:?<>|"*]/, "-"));
			});
		});

		var outlineView = $('.outline_view');

		var headObj = $('.column_content h3,.column_content h4')
    	if(headObj.length > 0){
        	var htmlStr = ""
        	var headText = ''
        	for(let i=0;i<headObj.length;i++){
            	$(headObj[i]).addClass(i+'')
            	headText = $(headObj[i]).text()
            	if($(headObj[i]).prop('tagName') == 'H3'){
                	htmlStr += "<div class='outline_h3' title='"+headText+"' target='"+i+"'>"+headText+"</div>"
            	}else if ($(headObj[i]).prop('tagName') == 'H4'){
                	htmlStr += "<div class='outline_h4' title='"+headText+"' target='"+i+"'>"+headText+"</div>"
            	}
        	}
        	outlineView.html(htmlStr)
        	$('.outline_view div:first').addClass('outline_select')
        	//- 根据动态的class模拟锚点效果
        	outlineView.on('click','div',function(){
            	outlineClick = true
            	var target = '.'+$(this).attr('target')
            	$(window).scrollTop($(target).offset().top-130)
            	selectScroll(outlineView,$(this));
            	//- 防止点击锚点后文章滑动误触发scroll事件
            	setTimeout(function(){
                	outlineClick = false
            	},1000)
        	})
    	}else{
        	$('.right_topic_outline').hide()
    	}

    	//TODO 滚动，锚点，标签联动
    	var outlineLength = outlineView.children().length;

    	$(window).scroll(function(){
        	if(!outlineClick){
            	nowTime = new Date().getTime()
            	if(!lastTime || nowTime - lastTime > gapTime){
                	for(let i=0;i<outlineLength;i++){
                    	let bounding = document.getElementsByClassName(i+'')[0].getBoundingClientRect().top;
                    	if(bounding>150 && bounding < $(window).height()){
                        	//- 滑动和点击锚点冲突，用两个样式控制
                        	let selectItem = $('div[target='+i+']');
                        	selectScroll(outlineView,selectItem);
                    	}
                	}
                	lastTime = nowTime
            	}
        	}
        })

        function selectScroll(container,item){
            outlineView.children('div').removeClass('outline_select');
            item.addClass('outline_select');
            //选中项相对于父容器的高度=选中大纲项相对于文档的偏移-父容器相对文档的偏移
            let selectHeight = item.offset().top-container.offset().top;
            //滑动到顶部距离=相对高度+已滑动距离
            //- container.scrollTop(selectHeight+container.scrollTop());
            container.animate({scrollTop:selectHeight+container.scrollTop()},500);
        }

        var topic_num;
        function getTopicNum(){
            $('.catelog_num').each(function(){
                var style = $(this).attr("style");
                if(typeof(style) != "undefined" && "color" == style.substring(0,5))
                    topic_num = parseFloat($(this).text());
            })
        }
        getTopicNum();

		var topic_title = $('.nav_topic_title').text();
		var topic_total = parseFloat(topic_title.match(/\/\d+/)[0].substring(1));
		
		var topic_pre = topic_num - 1;
		var topic_next = topic_num + 1;
		$('.catelog_num').each(function () {
			if(topic_num > 1 && topic_pre.toString()===$(this).text()){
				$('.topic_pre').attr('href', topic_pre.toString()+'.'+$(this).next().children().children().html()+'.html');
			};
			if(topic_num < topic_total && topic_next.toString()===$(this).text()){
				$('.topic_next').attr('href', topic_next.toString()+'.'+$(this).next().children().children().html()+'.html');
				$('.art_topic_next').attr('href', topic_next.toString()+'.'+$(this).next().children().children().html()+'.html');
			};
		})
	}
);
