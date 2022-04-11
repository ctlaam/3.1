$(document).ready(function () {
  formMode = 0; // 0 thêm mới ,1 sửa dữ liệu
  employeeIdSelected = null;
  employeeSelectedObject = {};
  loadData();
  initEvents();
});

function loadData() {
  try {
    $.ajax({
      async: false,
      type: "GET", //get - lây dữ liệu ,post-thêm cái mới,put-sửa dữ liệu,-delete-xóa dữ liệu
      url: "http://amis.manhnv.net/api/v1/Employees", //địa chỉ api
      // data:'data',// đối số gửi lên cho tham số của api (bodyrequest)
      dataType: "json", //kiểu dữ liệu tham số đối số
      contentType: "application/json", //kiểu dữ liệu trav ề
      success: function (response) {
        // nếu api thành công
        let employees = response;
        console.log(employees);
        let count = 1;
        let ths = $("#tblEmployeeList thead th");
        for (const emp of employees) {
          let trHTML = $(`<tr></tr>`);
          for (const th of ths) {
            // lấy attribute
            let propName = th.getAttribute("propName");
            let format = th.getAttribute("format");
            let tdHTML;

            // lấy dữ liệu tương ứng với propNamet
            let value = emp[propName];
            if (propName === "STT") {
              value = count;
              count++;
            }
            tdHTML = `<td>${value}</td>`;
            switch (format) {
              case "Date":
                // định dạng ngày tháng năm
                if (value) {
                  value = new Date(value);
                  // lây ra ngày
                  let date = value.getDate();
                  // lấy tháng
                  let month = value.getMonth() + 1;
                  // lấy năm
                  let year = value.getFullYear();
                  // thêm số 0 vào đằng trước
                  date = date < 10 ? `0${date}` : date;
                  month = month < 10 ? `0${month}` : month;
                  value = `${date}/${month}/${year}`;
                  tdHTML = `<td class="text-align-center">${value}</td>`;
                } else {
                  value = "";
                  tdHTML = `<td class="text-align-center">Chưa có</td>`;
                }
                break;
              case "Money":
                // định dạng tiền có phân cách
                if (true) {
                  value = Math.floor(Math.random() * 100000000);
                  value = value.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  });
                  tdHTML = `<td class="text-align-right">${value||"Chưa có"}</td>`;
                }
                break;
              default:
                tdHTML = `<td>${value ||"Chưa có"}</td>`;
                break;
            }

            // lưu trữ thông tin chi tiết của nhân viên vào data của tr
            trHTML.data("employeeId", emp.EmployeeId);
            trHTML.data("object", emp);
            //
            trHTML.append(tdHTML);
          }
          $("table tbody").append(trHTML);
        }
        // 1 duyệt các cột tiêu đề của bảng dữ liệu
        // 2.Đọc thông tin chi tiết về dữ liệu tương ứng

        // for (const emp of employees) {
        //     let employeeCode = emp.EmployeeCode
        //     let fullName = emp.EmployeeName
        //     let dateOfBirth = emp.DateOfBirth
        //     let departmentName = emp.DepartmentName
        //     if (dateOfBirth){
        //         dateOfBirth = new Date(dateOfBirth)
        //         // lây ra ngày
        //         let date = dateOfBirth.getDate()
        //         // lấy tháng
        //         let month = dateOfBirth.getMonth() + 1
        //         // lấy năm
        //         let year = dateOfBirth.getFullYear()
        //         // thêm số 0 vào đằng trước
        //         date = date < 10 ? `0${date}` : date
        //         month = month < 10 ? `0${month}` : month
        //         dateOfBirth = `${date}/${month}/${year}`

        //     }
        //     salary = salary.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        //     let trHtml =
        //      `<tr>
        //         <td class="text-align-left">${count}</td>
        //         <td class="text-align-left">${employeeCode}</td>
        //         <td class="text-align-left">${fullName}</td>
        //         <td class="text-align-center">${dateOfBirth || ''}</td>
        //         <td class="text-align-right">${departmentName}</td>
        //         <td class="text-align-right">${salary || ''}</td>
        //     </tr>`
        //     count++
        // $('table tbody').append(trHtml)
        // }
      },
      error: function () {
        // nếu gọi đến api có lỗi
      },
    });
  } catch (e) {}
}

function initEvents() {
  // button them moi
  var addPersonal = $("#btn-add");
  var dialog = $("#dlgDetail");
  var closeDialog = $(".m-dialog-close");
  var dialogForm = $(".m-dialog-form");

  // hien thui dialog
  addPersonal.on("click", function () {
    $("input").val(null);
    $("select").val(null);
    $("textarea").val(null);

    dialog.show();
    // focus vao ô đầu tiên
    $.ajax({
      type: "GET",
      url: "http://amis.manhnv.net/api/v1/Employees/NewEmployeeCode",
      success: function (response) {
        $("#txtEmployeeCode").val(response);
        $("#txtEmployeeCode").focus();
      },
    });
  });
  // tat dialog
  closeDialog.on("click", function () {
    dialog.hide();
  });
  $("#btnCancel").click(function () {
    dialog.hide();
  });
  // $("table#tblEmployeeList tbody tr").dblclick(function () {
  //   dialog.show()
  // });
  $(document).on("dblclick", "table#tblEmployeeList tbody tr", function () {
    formMode = 1;
    try {
      var employee = {};
      // C1- lây dữ liệu được lưu trữ dưới client ở mỗi dòng trong table
      // var employee = $(this).data("object")
      var employeeId = $(this).data("employeeId");
      // var employeeNameSelected = $(this).data("object").EmployeeName
      employeeIdSelected = employeeId;
      // C2 lấy ở dữ liệu api tương ứng
      $.ajax({
        async: false,
        type: "GET",
        url: `http://amis.manhnv.net/api/v1/Employees/${employeeId}`,
        success: function (response) {
          employee = response;
        },
      });
      // binding dữ liệu lên các trường thông tin tương ứng
      bindingDetailData(employee);
      // Hiện thị form chi tiết
      dialog.show();
    } catch (error) {}
    // THực hiện lất thông tin chi tiết
  });
  // lưu dữ liệu
  /**
   * Thực hiện lưu dữ liệu
   */
  $("#btn-save").click(btnSave);
  $("[required]").blur(function () {
    var value = $(this).val();
    if (!value) {
      // hiển thị border màu đỏ
      this.classList.add("error");
      $(this).attr("title", "Vui lòng nhập trường này");
    } else {
      this.classList.remove("error");
      $(this).removeAttr("title");
    }
  });
  //
  $(document).on("click", "table#tblEmployeeList tbody tr", function () {
    let trElements = $("table#tblEmployeeList tbody tr");
    if ($(this).hasClass("m-row-selected")) {
      $(this).removeClass("m-row-selected");
    } else {
      for (const trElement of trElements) {
        trElement.classList.remove("m-row-selected");
      }
      $(this).addClass("m-row-selected");
      // lưu lại id và object được chọn
      employeeIdSelected = $(this).data("employeeId");
      employeeSelectedObject = $(this).data("object");
      console.log(employeeSelectedObject)
    }
  });
  $("#btnDelete").click(function () {
    // hiện thị cảnh báo xóa
    commonJS.showConfirm(
      `Bạn có muốn xóa nhân viên &nbsp <b>${employeeSelectedObject.EmployeeName}</b>`,
      function () {
        // lấy ra id của nhân viên đã chọn
        // gọi đến api thực hiện xóa
        $.ajax({
          type: "DELETE",
          url: `http://amis.manhnv.net/api/v1/Employees/${employeeIdSelected}`,
          data: "data",
          dataType: "dataType",
          success: function (response) {
            // toast msg
            commonJS.showToastMsg("Xóa thành công")
            // load lại dữ liẹu
            loadData();
          },
        });
      }
    );
  });
}

function btnSave() {
  isValid = true;
  try {
    // validate dữ liẹu bắt buộc phải nhập
    if ($("#txtEmployeeCode").val() == "") {
      isValid = false;
      commonJS.showDialogMsg("Mã nhân viên phải được nhập");
    }
    if ($("#txtEmployeeName").val() == "") {
      isValid = false;
      commonJS.showDialogMsg("Vui lòng nhập tên");
    }
    // các thông tin nhập phải đúng ( email đúng định dạng,ngày sinh nhỏ hơn ngày hiện tại)
    // lưu ý thông tin số đt là free text nên không cần validate
    // mã nhân viên không quá 20 kí tự
    //Build đối tượng
    if (!isValid) {
      return;
    }
    employee = buildObject();
    // thực hiện gọi api cất dữ liệu

    if (formMode === 0) {
      $.ajax({
        type: "POST",
        url: "http://amis.manhnv.net/api/v1/Employees",
        data: JSON.stringify(employee),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
          commonJS.showToastMsg("Tạo thành công")
          $("#dlgDetail").hide();
          // thưc hiện load lại dữ liệu
          loadData();
        },
        error: function (response) {
          console.log(response);

          handleError(response);
        },
      });
    } else {
      $.ajax({
        type: "PUT",
        url: `http://amis.manhnv.net/api/v1/Employees/${employeeIdSelected}`,
        data: JSON.stringify(employee),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
          commonJS.showToastMsg("Sửa thành công")
          $("#dlgDetail").hide();
          // thưc hiện load lại dữ liệu
          loadData();
        },
        error: function (response) {
          handleError(response);
        },
      });
    }
  } catch (error) {}
}

function handleError(response) {
  var statusCode = response.status;
  var errorData = response.responseJSON;
  switch (statusCode) {
    case 400: // bad request dữ liệu đầu vào k hợp lệ
      commonJS.showDialogMsg(errorData.userMsg);
      break;
    case 500:
      commonJS.showDialogMsg(errorData.userMsg);
      break;
    case 404:
      break;
    default:
      break;
  }
}

// Build ra đối tượng cân lưu

function buildObject() {
  try {
    var employee = {};
    // quét toàn bộ inputs
    // lây ra toàn bộ attr là property -> căn cứ để xác định input nhận thông tin nào
    var inputs = $("#dlgDetail [property]");
    for (const input of inputs) {
      let propName = input.getAttribute("property");
      let propValue = $(input).val();
      employee[propName] = propValue;
    }
    return employee;
  } catch (error) {}
}

/**
 * Thực hiện binding dữ liệu
 * @pram {*} objectbinding
 */
function bindingDetailData(employee) {
  // lây ra toàn bộ attr là property -> căn cứ để xác định input nhận thông tin nào
  var inputs = $("#dlgDetail [property]");
  for (const input of inputs) {
    // lây thông tin property mà input binding
    let propName = input.getAttribute("property");
    let propValue = employee[propName];
    let inputType = input.getAttribute("type");
    switch (inputType) {
      case "date":
        if (propValue) {
          propValue = new Date(propValue);
          // lây ra ngày
          let date = propValue.getDate();
          // lấy tháng
          let month = propValue.getMonth() + 1;
          // lấy năm
          let year = propValue.getFullYear();
          // thêm số 0 vào đằng trước
          date = date < 10 ? `0${date}` : date;
          month = month < 10 ? `0${month}` : month;
          propValue = `${year}-${month}-${date}`;
        }
        break;
      default:
        break;
    }

    $(input).val(propValue);
  }
}

