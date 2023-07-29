import React, { useEffect } from 'react';
import { Router, Switch, Route, Link, NavLink } from "react-router-dom";
import { connect, useSelector } from 'react-redux';

import { history, UrlHelpers } from './helpers';
import { alertActions, userActions, learningExcercisesActions } from './actions';
import Footer from './footer/Footer';
import { NavigationBar } from './navigation-bar';
import { Home, AboutUs, Contact, FAQ } from './home';
import { SettingMain } from './settings';
import { Courses } from './courses';
import { CourseDetail } from './course-detail';
import { LearningLesson } from './learning';
import { Login, Register, ForgotPassword, ResetPassword, EmailConfirmation, EmailConfirmationHeader } from './auth';
import ScrollToTop from "./ScrollToTop";
import Error404 from './error/Error404';
import { LessonExcercises } from './excercise/LessonExcercises';
import { Loading, AlertComponent, Modal } from "./shared";
import './assets/scss/theme.scss';
import { CourseCheckout } from './course-detail';
import { contentPageService, userService } from './services';
import { ContentPage } from './home/ContentPage';
import { LiveSchedules } from './live-schedules/';
import MessengerCustomerChat from 'react-messenger-customer-chat';
import SimpleReactValidator from 'simple-react-validator';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Assessment } from './assessments/Assessment';
import { Blog } from './blog/Blog';
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    },
  },
})

class App extends React.Component {
  constructor(props) {
    super(props);

    window.dataLayer.push({
      event: 'pageview'
    });

    this.state = {
      contentPages: []
    }

    history.listen((location, action) => {
    });

    window.feedback = (model, formId) => {
      const validator = new SimpleReactValidator();
      if (!validator.check(model.fullName, 'required')) {
        alertActions.error("Vui lòng nhập họ và tên của bạn");
        return;
      }

      if (!validator.check(model.email, 'required|email')) {
        alertActions.error("Vui lòng nhập chính xác email");
        return;
      }

      var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
      if (!validator.check(model.phone, 'required') || !phone_regex.test(model.phone)) {
        alertActions.error("Vui lòng nhập chính xác số điện thoại");
        return;
      }

      if (!validator.check(model.content, 'required')) {
        alertActions.error("Vui lòng nhập nội dung");
        return;
      }

      userService.feedback(model)
        .then(res => {
          if (res.isSuccess) {
            alertActions.success("Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ liên hệ lại cho bạn trong thời gian sớm nhất");
            document.getElementById(formId)?.reset()
          }
        })
    }
  }

  componentDidCatch(error, info) {

  }

  componentDidMount() {
    contentPageService.getContentPagesBrief()
      .then(res => {
        if (res.isSuccess) {
          this.setState({
            contentPages: res.data
          })
        }
      });
  }

  render() {
    const { needConfirmEmail, loggedIn } = this.props;
    const { contentPages } = this.state
    if (process.env.NODE_ENV == "production") {

    }

    return (
      <QueryClientProvider client={queryClient}>
        <ThemeComponent />
        {needConfirmEmail && <EmailConfirmationHeader />}
        <ScrollToTop>
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GoogleClientId}>
            <div className='application'>
              <div></div>
              <NavigationBar />
              <Switch>
                {contentPages.map(item => (
                  <Route path={item.url} exact component={Register} key={item.id}>
                    <ContentPage id={item.id} />
                  </Route>
                ))}
                <Route path='/register' exact component={Register} />
                <Route path='/login' exact component={Login} />
                <Route path='/forgot-password' exact component={ForgotPassword} />
                <Route path='/email-confirmation' component={EmailConfirmation} />
                <Route path='/reset-password' component={ResetPassword} />
                <Route path="/" exact component={Home} />
                {/* <Route path="/about-us" exact component={AboutUs} /> */}
                <Route path="/contact" exact component={Contact} />
                {/* <Route path="/faq" exact component={FAQ} /> */}
                <Route path="/live-schedules" component={LiveSchedules} />
                <Route path="/books" component={Blog} />
                {loggedIn &&
                  <Route path="/user/*" exact component={SettingMain} />
                }
                <Route path="/courses/:filterType?/:name?/:id?" component={Courses} />
                <Route path="/assessment/:attemptGuid" component={Assessment} />
                <Route path={UrlHelpers.courseDetailPath} exact component={CourseDetail}></Route>
                <Route path={UrlHelpers.courseCheckout} exact component={CourseCheckout}></Route>
                {loggedIn &&
                  <Route path={UrlHelpers.learningPath} component={LearningLesson}></Route>
                }
                <Route component={Error404} />
              </Switch>
              <Footer />
            </div>
          </GoogleOAuthProvider>
        </ScrollToTop>
        {process.env.NODE_ENV != "development" &&
          < MessengerCustomerChat
            pageId={process.env.REACT_APP_FacebookPageId}
            appId={process.env.REACT_APP_FacebookAppId}
            version='12.0'
          />
        }
      </QueryClientProvider>
    );
  }
}

const ThemeComponent = (props) => {
  const theme = useSelector(state => state.themeState)
  useEffect(() => {
    document.body.setAttribute('theme', theme.name);

    return () => {
      document.body.removeAttribute('theme');
    }
  }, [theme]);

  return (
    <>
    </>
  )
}

function mapStateToProps(state) {
  const { authentication } = state;
  const { userInfomation, needConfirmEmail, loggedIn } = authentication;
  return { userInfomation, needConfirmEmail, loggedIn };
}

const actionCreators = {
  getMyCourses: userActions.getMyCourses,
  clearExcercises: learningExcercisesActions.clear,
  clearAlert: alertActions.clear,
  successAlert: alertActions.success
};

export default connect(mapStateToProps, actionCreators)(App);
