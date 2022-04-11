$(document).ready(function() {
    new ComboboxJS();
})

class ComboboxJS {
    constructor() {
        this.buildComboboxHTML();
        // this.buildComboboxData();
        this.initEvents();
    }

    buildComboboxHTML() {
            // 1. Quét toàn bộ các combobox customer (mcombobox):
            var mcomboboxs = $('mcombobox');
            // 2. Duyệt từng đối tượng lấy được trong mảng:
            for (const comboboxOrigil of mcomboboxs) {
                let api = $(comboboxOrigil).attr('api');
                let id = $(comboboxOrigil).attr('id');
                let propValue = $(comboboxOrigil).attr('propValue');
                let propText = $(comboboxOrigil).attr('propText');
                let newComboboxHTML = $(`<div id="${id}" class="m-combobox" mcombobox>
                                            <input type="text" class="m-input">
                                            <button class="m-combobox-button"></button>
                                            <div class="m-combobox-data">
                                            </div>
                                        </div>`);
                // Gọi api thực hiện lấy dữ liệu:
                $.ajax({
                    async: false,
                    type: "GET",
                    url: api,
                    success: function(data) {
                        // Build HTML:
                        for (const item of data) {
                            var itemHTML = `<div class="m-combobox-item" value="${item[propValue]}">${item[propText]}</div>`;
                            $(newComboboxHTML).find('.m-combobox-data').append(itemHTML);
                        }

                    }
                });
                $(comboboxOrigil).replaceWith(newComboboxHTML);
            }
            // 3. Đọc các thông tin đã khai báo:

            // 4. Build HTML và append vào DOM:
        }
        /**
         * Khởi tạo các event cho combobox
         * Author: NVMANH (21/03/2022)
         */
    initEvents() {
        $('[mcombobox] .m-combobox-button').click(this.comboboxButtonOnClick);
        $('[mcombobox] .m-combobox-item').click(this.comboboxItemOnSelect);
        $('[mcombobox]').bind("setValue", function(events, value) {
            var me = this;
            // 1. Quét toàn bộ các item
            let items = $(this).find('.m-combobox-item');
            // 2. Duyệt các item con có value tương ứng:
            for (const item of items) {
                // 2.1 - Lấy ra value của item:
                let valueCurrentItem = $(item).attr('value');
                // Nếu giá trị truyền vào trùng với giá trị của item hiện tại
                if (value == valueCurrentItem) {
                    // Xóa các selected cũ:
                    $(items).removeClass('m-combobox-selected');
                    // Set trạng thái cho item hiện tại là selected:
                    item.classList.add('m-combobox-selected');
                    // Set value selected cho combobox và text hiển thị của input:
                    $(me).children('input').val(item.textContent);
                    $(me).data('value', value);
                    // Dừng luôn vòng lặp:
                    return;
                }
            }
            console.log(items);
        });
        $.fn.setValue = function(value) {
            // Kiểm tra thông tin của element hiện tại gọi đến method:
            if (this[0].hasAttribute('mcombobox')) {
                // Nếu là element của combobox custom thì thực hiện việc gán dữ liệu cho combobox:
                var me = this;
                // 1. Quét toàn bộ các item
                let items = $(this).find('.m-combobox-item');
                // 2. Duyệt các item con có value tương ứng:
                for (const item of items) {
                    // 2.1 - Lấy ra value của item:
                    let valueCurrentItem = $(item).attr('value');
                    // Nếu giá trị truyền vào trùng với giá trị của item hiện tại
                    if (value == valueCurrentItem) {
                        // Xóa các selected cũ:
                        $(items).removeClass('m-combobox-selected');
                        // Set trạng thái cho item hiện tại là selected:
                        item.classList.add('m-combobox-selected');
                        // Set value selected cho combobox và text hiển thị của input:
                        $(me).children('input').val(item.textContent);
                        $(me).data('value', value);
                        // Dừng luôn vòng lặp:
                        return;
                    }
                }
            }
        }

        $.fn.getValue = function() {
            // Kiểm tra thông tin của element hiện tại gọi đến method:
            if (this[0].hasAttribute('mcombobox')) {
                // Lấy ra data của combobox đã lưu giá trị selected trước đó:
                var dataValue = $(this[0]).data('value');
                return dataValue;
            }
        }
    }

    buildComboboxData() {
            // Gọi api thực hiện lấy dữ liệu:
            $.ajax({
                async: false,
                type: "GET",
                url: "http://amis.manhnv.net/api/v1/Departments",
                success: function(data) {
                    // Build HTML:
                    for (const item of data) {
                        var itemHTML = `<div class="m-combobox-item" value="${item["DepartmentId"]}">${item["DepartmentName"]}</div>`;
                        $('[mcombobox] .m-combobox-data').append(itemHTML);
                    }

                }
            });

        }
        /**
         * Khi chọn 1 item trong combobox:
         * Author: NVMANH (21/03/2022)
         */
    comboboxButtonOnClick() {
        // Lấy ra combobox data:
        var comboboxDataHTML = this.nextElementSibling;
        // Kiểm tra trạng thái hiển thị của combobox data:
        var display = comboboxDataHTML.style.display;

        // Nếu đang hiển thị thì ẩn, nếu đang ẩn thì hiển thị:
        if (display == "block")
            comboboxDataHTML.style.display = 'none';
        else
            comboboxDataHTML.style.display = 'block';

        // $('.m-combobox-data').toggle();
    }

    /**
     * Khi chọn 1 item trong combobox:
     * Author: NVMANH (21/03/2022)
     */
    comboboxItemOnSelect() {
        try {
            // Lấy ra text:
            let text = this.textContent;
            // Lấy ra value của iem:
            let value = $(this).attr('value');
            console.log(value);
            // Lấy ra element input của combobox hiện tại:
            // 1.1 - Lấy ra element cha:
            let parentElement = this.parentElement;
            // 1.2 - Lấy ra element input ngang cấp với element cha:
            let input = $(parentElement).siblings('input');

            // Gán text cho input của combobox:
            input.val(text);

            // Xóa tất cả style selected của item đã chọn trước đó (nếu có);
            let itemSelecteds = $(this).siblings('.m-combobox-selected');
            itemSelecteds.removeClass('m-combobox-selected');

            // Set style selected cho item vừa chọn:
            this.classList.add('m-combobox-selected');

            // Thực hiện lưu trữ value của item:
            var rootElement = $(this).parents('.m-combobox[mcombobox]');
            rootElement.data('value', value);
            // Ẩn combobox data đi:
            $('[mcombobox] .m-combobox-data').hide();
        } catch (error) {
            console.log(error);
        }
    }
}