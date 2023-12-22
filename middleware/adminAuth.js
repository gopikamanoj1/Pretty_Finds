const isLogin = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            // console.log(req.session.admin_id,"req.session.admin_id");
            next();
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            res.redirect('/admindashboard');
        } else {
            next(); // This should be inside the "else" block
        }
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    isLogin,
    isLogout
}
