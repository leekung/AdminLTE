$(document).ready(function () {
    $("form").sisyphus({locationBased: true, excludeFields: $('input[name="_token"]')});

    $('[data-slug="source"]').each(function(){
	    $(this).slug();
	});

    $(document).ajaxStart(function() { Pace.restart(); });

    Mousetrap.bind('f1', function() {
        window.open('https://asgardcms.com/docs', '_blank');
    });
});
//Lee add auto translate
$(function(){
    if (document.location.href.match(/\/translation\/translations$/)) {
        setTimeout(function(){
            $(".btn-group.pull-right").prepend('<a class="btn bg-maroon btn-flat auto-translate" href="javascript:;">Auto Translate</a>');
            $(".auto-translate").click(function(){
                var $btn = $(this), $empties = $(".editable-empty"), done = 0;
                if($empties.length) {
                    $btn.button('loading');
                    $empties.each(function(){
                        var $this = $(this),
                            key = $this.data("pk"),
                            locale = key.replace(/(.+?)__-__.*/, "$1"),
                            pkEn = key.replace(/(.+?)__-__/, "en__-__"),
                            key = key.replace(/(.+?)__-__(.*)/, "$2"),
                            enTxt = $("[data-pk='"+pkEn+"']").text().replace(/(\:([^\s|\.]+))/g, "[__$2__]");

                        $.post("/trans/index.php", {
                            value: enTxt,
                            locale: locale
                        }, "json").done(function(data1){
                            if (data1.result == 1) {
                                $.post('/api/translation/update', {
                                    locale: locale,
                                    key: key,
                                    value: data1.message,
                                    _token: $("#token").attr("value")
                                }).done(function(data2){
                                    $this.html(data1.message);
                                    $this.editable('option', {value: data1.message});
                                    $this.removeClass('editable-empty').addClass('text-danger');
                                    done++;
                                    if(done >= $empties.length) {
                                        $btn.button('reset');
                                    }
                                });
                            } else {
                                done++;
                            }

                        });
                    });
                }
            });
        }, 1000);
    }
});
