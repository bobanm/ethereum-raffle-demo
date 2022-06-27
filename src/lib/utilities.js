import toastr from "toastr";
export const displayNotification = (
    alert = "success",
    title,
    message,
    options
) => {
    const toastrOptions = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-top-center",
        preventDuplicates: false,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

    toastr.options = Object.assign({}, toastrOptions, options);
    toastr[alert](title, message);
};
