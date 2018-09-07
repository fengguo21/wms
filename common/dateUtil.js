var dateUtil = {

    //将Date类型格式化为时间字符串，如1992-10-01 10:34:45
    formatDate: function(date, dateSign, timeSign) {
        dateSign = dateSign || "-";
        timeSign = timeSign || ":";
        let year = "1970";
        let month = "01";
        let day = "01";
        let hour = "00";
        let minute = "00";
        let second = "00";

        if (date instanceof Date) {
            year = date.getFullYear() + "";
            month = date.getMonth() + 1;
            month = (month >= 10) ? (month + "") : (0 + month + "");
            day = date.getDate();
            day = (day >= 10) ? (day + "") : ("" + 0 + day);
            hour = date.getHours();
            hour = (hour >= 10) ? (hour + "") : ("" + 0 + hour);
            minute = date.getMinutes();
            minute = (minute >= 10) ? (minute + "") : ("" + 0 + minute);
            second = date.getSeconds();
            second = (second >= 10) ? (second + "") : ("" + 0 + second);
        }

        return year + dateSign + month + dateSign + day + " " + hour + timeSign + minute + timeSign + second;
    }
}
module.exports = dateUtil;