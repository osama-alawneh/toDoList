const today = new Date();

const getDate = ()=>{
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    return today.toLocaleDateString("en-US", options);

}
const getDay = ()=>{
    const options = {
        weekday: "long",
    };
   return today.toLocaleDateString("en-US", options);
}


module.exports.getDate = getDate;
module.exports.getDay = getDay;