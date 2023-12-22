const isLogin = (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in, proceed to the next middleware or route
            next();
        } else {
            // User is not logged in, redirect to the login page
            res.redirect('/page-login');
        }
    } catch (error) {
        console.log(error.message);
    }
};

const isLogout = (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in, redirect to the home page
            res.redirect('/home');
        } else {
            // User is not logged in, proceed to the next middleware or route
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
}


const tohome=(req,res,next)=>{
    try {
        if (!req.session.user_id) {
            // User is logged in, redirect to the home page
            res.redirect('/');
        } else {
            // User is not logged in, proceed to the next middleware or route
            next();
        }
        
    } catch (error) {
        
    }
}




module.exports = {
    isLogin,
    isLogout,
    tohome,
    
}
