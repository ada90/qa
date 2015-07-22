var appFunc = {

    timeFormat: function(ms){

        ms = ms * 1000;
        var d_second,d_minutes, d_hours, d_days;
        var timeNow = new Date().getTime();
        var d = (timeNow - ms)/1000;
        d_days = Math.round(d / (24*60*60));
        d_hours = Math.round(d / (60*60));
        d_minutes = Math.round(d / 60);
        d_second = Math.round(d);
        if (d_days > 0 && d_days < 2) {
            return d_days + i18n.global.day_ago;
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + i18n.global.hour_ago;
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + i18n.global.minute_ago;
        } else if (d_minutes <= 0 && d_second >= 0) {
            return i18n.global.just_now;
        } else {
            var s = new Date();
            s.setTime(ms);
            return (s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate()) + ' '+ f(s.getHours()) + ':'+ f(s.getMinutes()));
        }

        function f(n){
            if(n < 10)
                return '0' + n;
            else
                return n;
        }
    },

    matchUrl: function(string){
        var reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&;:\/~\+#]*[\w\-\@?^=%&;\/~\+#])?/g;

        string = string.replace(reg,function(a){
            if(a.indexOf('http') !== -1 || a.indexOf('ftp') !== -1){
                return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'' + a + '\',\'_blank\')\">' + a + '</a>';
            }
            else
            {
                return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'http://' + a + '\',\'_blank\')\">' + a + '</a>';
            }
        });
        return string;
    }
};


var timelineView = {
    init : function(scrollEl){
        this.$el = $(scrollEl)
        this.infinitusLoad(scrollEl);
    },
    infinitusLoad : function(scrollEl){

        if(this.data && this.data.scrollLoading == 'loading' ) return;

        console.log("load数据")
        this.data = {'scrollLoading':'loading'};
        var t = this;
        $.ajax({
            url: 'timeline.json' ,
            method: 'get',
            data: '',
            success:function(data){

                if(typeof data != "object"){

                    data = data ? JSON.parse(data) : '';
                }

                setTimeout(function(){
                var list = data.data

                for(var i=0;i<list.length;i++){

                    var opichtml = "";
                    if(list[i].original_pic){
                        opichtml = '<div class="item-image"> \
                                        <img class="" src=" '+ list[i].original_pic+' " alt=""> \
                                        </div> '
                    }

                    $('.time-line-content').append('<li data-id="41" class="item-content card-content"> \
                    <div class="item-inner">  \
                    <div class="item-header">  \
                    <div class="avatar">      \
                    <img data-avatarid="01" src=" ' + list[i].avatar + '"> \
                    </div> \
                    <div class="detail">  \
                    <p class="nickname">'+list[i].nickname+'</p> \
                    <p data-time="1404709434" class="create-time">'+ appFunc.timeFormat(list[i].created_at) +'</p> \
                    </div> \
                    </div> \
                    <div class="click-content"> \
                    <div class="item-subtitle">'+ appFunc.matchUrl(list[i].text) +' </div> '+
                    opichtml +
                    '</div> \
                    </div> \
                    </li>')
                }
                t.data.scrollLoading = '';
                    t.data.sH = t.$el[0].scrollHeight;//添加数据后滚动内容高度改变，需重新获取，获取数据可能延时，如果加载数据后不重新获取高度，可能会是上一次的值

                },1000) //加延时模拟预加载效果




            }
        });

    }
}
