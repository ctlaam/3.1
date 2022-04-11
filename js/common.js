var commonJS = {
  showDialogMsg: function (msg) {
    if (!msg) {
      msg = "Có lỗi xảy ra , vui lòng liên hệ MISA";
    }
    $("[MISADialog]").remove();
    let dialogHTML = `<div id="dlgMsg" MISADialog class="m-dialog-box">
        <div class="m-dialog">
          <div id="closeMsg" class="m-dialog-close2">
          </div>
          <div class="m-dialog-header">Thông báo</div>
          <div class="m-dialog-body">${msg}</div>
          <div class="m-dialog-footer">
            
            <button class="m-btn">
              <div class="btn-ok-default text-btn">Đồng ý</div>
            </button>
          </div>
        </div>
      </div>`;
    $("body").append(dialogHTML);
    $("#dlgMsg").show();
    $(".m-dialog-close2").click(function () {
      $("#dlgMsg").hide();
    });
    $("[MISADialog] button .btn-ok-default").click(function () {
      $("[MISADialog]").remove();
    });
  },
  /**
   * @param {string}
   * @param {function}
   */
  showConfirm(msg, callBackFunction) {
    $("[MISADialog]").remove();
    let dialogHTML = `<div id="dlgMsg" MISADialog class="m-dialog-box">
        <div class="m-dialog">
          <div id="closeMsg" class="m-dialog-close2">
          </div>
          <div class="m-dialog-header">Thông báo</div>
          <div class="m-dialog-body">${msg}</div>
          <div class="m-dialog-footer">
             <button id="btnCancel" class="m-btn m-cancel ">Hủy</button>
            <button class="m-btn-ok">
              <div class="btn-ok text-btn">Đồng ý</div>
            </button>
          </div>
        </div>
      </div>`;
    if (callBackFunction) {
      $(document).on("click", "button.m-btn-ok .btn-ok", callBackFunction);
      $(document).on("click", "button.m-btn-ok .btn-ok", () => {
        $("[MISADialog]").remove();
      });
    } else {
      $(document).on("click", "button.m-btn-ok .btn-ok", () => {
        $("[MISADialog]").remove();
      });
    }
    $("body").append(dialogHTML);
    $("#dlgMsg").show();
    $(".m-dialog-close2").click(function () {
      $("#dlgMsg").hide();
    });
    $("[MISADialog] button .btn-ok-default").click(function () {
      $("[MISADialog]").remove();
    });

    $("[MISADialog] button#btnCancel").click(function () {
      $("[MISADialog]").remove();
    });
  },
  //   toast mes
  showToastMsg: function (msg) {
    if (!msg) {
      msg = "Thực hiện thành công";
    }
    let tsHTML = `<div id="tsBoxSuccess" class="m-toast-message toast-success  ">
      <div class="flex">

          <div class="m-icon-toast">
              <i class="fa-solid fa-check"></i>
          </div>
          <p class="text-toast">
              ${msg}
          </p>
          <div class="m-close-toast">
              <i class="fa-solid fa-xmark"></i>
          </div>
      </div>
  </div>`;
    $("body").append(tsHTML);
    $("#tsBoxSuccess").show();
    setTimeout(() => {
      $("#tsBoxSuccess").remove();
    },3000);
  },
};

