//window.onload = function () {
// 选中效果

$('.condition-tags .condition-tag').click(function () {
    $(this).addClass("condition-tag-checkable-checked").siblings().removeClass('condition-tag-checkable-checked');
});
// 时间筛选选中切换效果
$('.condition-radio-group .condition-radio-button-wrapper').click(function () {
    $(this).addClass("condition-radio-button-wrapper-checked").siblings().removeClass('condition-radio-button-wrapper-checked');
});
$('.operation div .collection').click(function () {
    $(this).hide().siblings().show();
});
// 下拉组件遍历

$('select.dropdown').each(function () {
    var dropdown = $('<div />').addClass('dropdown selectDropdown');

    $(this).wrap(dropdown);

    var label = $('<span />').text($(this).attr('placeholder')).insertAfter($(this));
    var list = $('<ul />');

    $(this).find('option').each(function () {
        list.append($('<li />').append($('<a />').text($(this).text())));
    });

    list.insertAfter($(this));

    if ($(this).find('option:selected').length) {
        label.text($(this).find('option:selected').text());
        list.find('li:contains(' + $(this).find('option:selected').text() + ')').addClass('active');
        $(this).parent().addClass('filled');
    }

});

$(document).on('click touch', '.selectDropdown ul li a', function (e) {
    e.preventDefault();
    var dropdown = $(this).parent().parent().parent();
    var active = $(this).parent().hasClass('active');
    var label = active ? dropdown.find('select').attr('placeholder') : $(this).text();

    dropdown.find('option').prop('selected', false);

    dropdown.find('ul li').removeClass('active');

    if (!active) {
        dropdown.find('option:contains(' + $(this).text() + ')').prop('selected', true);
        $(this).parent().addClass('active');
    }

    dropdown.children('span').text(label);
    dropdown.removeClass('open');
});

$('.dropdown > span').on('click touch', function (e) {
    var self = $(this).parent();
    self.toggleClass('open');
});
// }