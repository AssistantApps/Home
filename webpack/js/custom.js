import * as $ from './jquery.min.js';

$(function () {
    function starsParallax() {
        const starsParallaxElems = document.getElementsByClassName('star-parallax');
        const starsParallaxInstances = [];
        for (const starsParallaxElem of starsParallaxElems) {
            starsParallaxInstances.push(new Parallax(starsParallaxElem));
        }
    }

    function customOnLoad() {
        try {
            if ((screen?.width ?? 0) > 1000) {
                var s = skrollr.init(); // global skrollr instance
                starsParallax();
                document.getElementsByTagName('body')?.[0]?.classList?.add('parallax')
            }
        } catch { }
    }

    setTimeout(() => {
        customOnLoad?.();
    }, 250);

    function formPostResult(data) {
        if (data.status == 200) {
            $('form#contact-form').hide();
            $('#success_message').show();
            $('#error_message').hide();
        } else {

            $('#success_message').hide();
            $('#error_message').show();

            var form = $('#contact_form');
            //reverse the response on the button
            form.find('input#submit').each(function () {
                var btn = $(this);
                var label = btn.prop('orig_label');
                if (label) {
                    btn.prop('disabled', false);
                    btn.val(label);
                    btn.prop('orig_label', '');
                }
            });
        }
    }

    $('#success_message').hide();
    $('#error_message').hide();
    $('#contact_form').submit(function (e) {
        e.preventDefault();

        var form = $(this);
        form.find('input#submit').each(function () {
            var btn = $(this);
            btn.prop('orig_label', btn.val());
            btn.prop('disabled', true);
            btn.val('Sending ...');
        });

        var formObj = {
            name: form[0][0]?.value || '',
            email: form[0][1]?.value || '',
            message: form[0][2]?.value || '',
            captcha: form[0][4]?.value || ''
        };

        $.ajax({
            type: "POST",
            url: 'https://api.assistantapps.com/contact',
            // url: 'http://localhost:55555/contact',
            data: JSON.stringify(formObj),
            success: formPostResult,
            error: formPostResult,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        });
    });
});