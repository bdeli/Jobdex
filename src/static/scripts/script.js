'use strict';

var app = angular.module('jobdex_app', ['ngCookies']);

$("#login").leanModal({top : 100, overlay : 0.6, closeButton: ".modal_close" });

PDFJS.workerSrc = "/static/bower_components/pdf.worker.js";
$(".create_account").click(function(){
    $(".user_register").show();
    $(".user_login").hide();
    $(".header_title").text('Register');
    return false;
});

$("#login").click(function() {
    $(".user_login").show();
    $(".user_register").hide();
    $(".header_title").text('Login');
    return false;
});


jQuery(document).ready(function() {

    jQuery('#tab-links a').on('click', function(e)  {

        var currentAttrValue = jQuery(this).attr('href');

        // Show/Hide Tabs
        jQuery('#card-detail-tabs ' + currentAttrValue).siblings().hide();
        jQuery('#card-detail-tabs ' + currentAttrValue).show();

        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active-tab').siblings().removeClass('active-tab');
        e.preventDefault();
    });

    $("#tab-links .active-tab a").click();

});

$('input[type=text]').focusout(function() {
    if ($(this).val().length == 0) {
        $(this).css({
            'border': '1px solid red',
        });
    } else {
        $(this).css({
            'border': '1px solid #DDD',
        });
    }
});
