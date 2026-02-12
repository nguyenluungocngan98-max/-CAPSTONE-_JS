export default class Validation {
    checkEmpty(value, divId, mess) {
        if (value === "") {
            document.getElementById(divId).innerHTML = mess;
            document.getElementById(divId).style.display = "block";
            return false;//stop
        }
        document.getElementById(divId).innerHTML = "";
        document.getElementById(divId).style.display = "none";
        return true;
    }

    checkCharacter(value, divId, mess) {
        // cần phải tạo một cái chuỗi regex => kiểm tra kí tự
        const letter = "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" + "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" + "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$";

        if (value.match(letter)) {
            //hợp lệ
            document.getElementById(divId).innerHTML = "";
            document.getElementById(divId).style.display = "none";
            return true;
        }
        //không hợp lệ
        document.getElementById(divId).innerHTML = mess;
        document.getElementById(divId).style.display = "block";
        return false;
    }

    checkLengthCharacter(value, divId, mess, min, max) {
        if (value.trim().length >= min && value.trim().length <= max) {
            document.getElementById(divId).innerHTML = "";
            document.getElementById(divId).style.display = "none";
            return true;

        }
        document.getElementById(divId).innerHTML = mess;
        document.getElementById(divId).style.display = "block";
        return false;

    }
    checkSelectOption(idSelect, divId, mess) {
        const element = document.getElementById(idSelect);
        if (element.selectedIndex !== 0) {
            //hợp lệ
            document.getElementById(divId).innerHTML = "";
            document.getElementById(divId).style.display = "none";
            return true;
        }
        document.getElementById(divId).innerHTML = mess;
        document.getElementById(divId).style.display = "block";
        return false;
    }


checkIdExist(value, divId, mess, listProducts) {
    // Tìm xem có sản phẩm nào có ID trùng không
    const isExist = listProducts.some(product => product.id == value);
    
    if (isExist) {
        // ID đã tồn tại - KHÔNG hợp lệ
        document.getElementById(divId).innerHTML = mess;
        document.getElementById(divId).style.display = "block";
        return false; // Trả về false
    }
    
    // ID chưa tồn tại - hợp lệ
    document.getElementById(divId).innerHTML = "";
    document.getElementById(divId).style.display = "none";
    return true; // Trả về true
}


}