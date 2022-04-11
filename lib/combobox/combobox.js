$(document).ready(function () {
  new ComboBoxJS();
});

class ComboBoxJS {
  constructor() {
    this.buildComboboxHTML();
    // this.buildComboboxData();
    this.initEvents();
  }
  buildComboboxHTML() {
    //   quét toàn bộ các combobox customer
    var mcomboboxs = $("mcombobox");
    // duyệt từng đối tượng lấy tỏng mảng
    for (const comboboxOrigin of mcomboboxs) {
      let api = comboboxOrigin.getAttribute("api");
      let id = comboboxOrigin.getAttribute("id");
      let propValue = comboboxOrigin.getAttribute("propValue");
      let propText = comboboxOrigin.getAttribute("propText");
      let newComboboxHTMl = $(`<div id="${id}" class="m-combobox" mcombobox>
        <p class="placeholder">Chọn nhập thông tin</p>
        <div class="icon-combobox">
          <i class="fa-solid fa-angle-down"></i>
        </div>
        <div class="m-choice-combobox"></div>
      </div>`);
      //   gọi api lấy dữ liệu
      $.ajax({
        async: false,
        type: "GET",
        url: api,

        success: function (data) {
          // build html

          for (const item of data) {
            var itemHTML = `<div class="m-choice" value="${item[propValue]}">
              <i class="fa-solid fa-check icon-active"></i>${item[propText]}
            </div>`;
            $(newComboboxHTMl).find(".m-choice-combobox").append(itemHTML);
          }
        },
      });
      $(comboboxOrigin).replaceWith(newComboboxHTMl);
      // 3.Đọ các thông tin đã khai báo
      // 4 build html và append vào DOM
    }
  }
  /**
   * Khởi tạo các events cho combobox
   *
   */
  initEvents() {
    $("[mcombobox] .icon-combobox").click(this.comboboxButtonOnClick);
    $("[mcombobox] .m-choice").click(this.comboboxChoiceOnClick);
    // $("[mcombobox]").bind("setValue", function (events, value) {
    //   var _this = this;
    //   // quét toàn bộ choice
    //   let choices = $(this).find(".m-choice");
    //   $(choices).removeClass("active");
    //   // duyệt các item con có value tương ứng
    //   for (const choice of choices) {
    //     // lấy ra value của item
    //     let valueChoiceCurrent = choice.getAttribute("value");
    //     // nếu giá trị chuyền vào trùng vói giá trị item
    //     if (value == valueChoiceCurrent) {
    //       // Xóa các selected cũ
    //       // set trạng thái cho item hiện tịa là selected
    //       choice.classList.add("active");
    //       // set value selected cho combobox và text hiện thị của input
    //       let text = choice.textContent;
    //       $(_this).children("p").html(text);
    //       break;
    //     }
    //   }
    // });
    $.fn.setValue = function (value) {
      // kiểm tra thông tin của element hiện tại gọi đến method
      if (this[0].hasAttribute("mcombobox")) {
        // nếu là element của comboxbox custom thì thực hiện
        var _this = this;
        // quét toàn bộ choice
        let choices = $(this).find(".m-choice");
        $(choices).removeClass("active");
        // duyệt các item con có value tương ứng
        for (const choice of choices) {
          // lấy ra value của item
          let valueChoiceCurrent = choice.getAttribute("value");
          // nếu giá trị chuyền vào trùng vói giá trị item
          if (value == valueChoiceCurrent) {
            // Xóa các selected cũ
            // set trạng thái cho item hiện tịa là selected
            choice.classList.add("active");
            // set value selected cho combobox và text hiện thị của input
            let text = choice.textContent;
            $(_this).children("p").html(text);
            $(_this).data("value", text);
            break;
          }
        }
      }
    };
    $.fn.getValue = function () {
      if (this[0].hasAttribute("mcombobox")) {
        // lấy ra data của combobox đã lưu giá trị selected trước đó
        var dataValue = $(this[0]).data("value");
        return daValue;
      }
    };
  }

  buildComboboxData() {
    //   gọi api
    $.ajax({
      async: false,
      type: "GET",
      url: "http://amis.manhnv.net/api/v1/Departments",

      success: function (data) {
        // build html
        for (const item of data) {
          var itemHTML = `<div class="m-choice" value="${item["DepartmentId"]}">
            <i class="fa-solid fa-check icon-active"></i>${item["DepartmentName"]}
          </div>`;
          $("[mcombobox] .m-choice-combobox").append(itemHTML);
        }
      },
    });
  }

  comboboxButtonOnClick() {
    // lay ra combobox choice
    var comboboxDataHTML = this.nextElementSibling;

    // kiem tra trang thai cua combobox choices
    var isDisplay = comboboxDataHTML.style.display;
    if (isDisplay === "block") {
      $($(this).parent()).removeClass("m-combobox-active");
      comboboxDataHTML.style.display = "none";
    } else {
      $($(this).parent()).first().addClass("m-combobox-active");
      comboboxDataHTML.style.display = "block";
    }
    // hiện thị comboxbox choice tương ứng với combobox hiện tại
    // $(".m-choice-combobox").toggle()
  }

  // khi chon mot choice trong combobox
  comboboxChoiceOnClick() {
    try {
      let text = this.textContent;
      // lay value choice
      let value = this.getAttribute("value");
      //1.1 lấy ra element cha
      let parentElement = this.parentElement;
      // lấy ra element the p
      let input = $(parentElement).siblings("p");
      // gán text cho input
      $(input).html(text);
      // Set style selected choice
      $(this).siblings().removeClass("active");
      this.classList.add("active");
      // An choices di
      $(".m-choice-combobox").hide();
      $($(input).parent()).removeClass("m-combobox-active");
      // thực hiện lưu trữ value của choice
      var rootElement = $(this).parents(".m-combobox[mcombobox]");
      rootElement.data("value", value);
    } catch (error) {}
  }
}
