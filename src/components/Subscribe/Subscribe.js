import React from "react";
import injectSheet from "react-jss";
import TextField from "material-ui/TextField";
import PropTypes from "prop-types";
import Color from "color";

import { LOGOS } from "../../constants/logos";
import SvgEl from "../shared/SvgEl";
import BlockButton from "../shared/BlockButton";
import Loading from "../shared/Loading/";

const styles = theme => ({
  root: {
    bottom: "60px",
    color: "#fff",
    left: 0,
    overflow: "auto",
    position: "absolute",
    right: 0,
    top: 0
  },
  logo: {
    display: "inline-block",
    width: "80px",
    verticalAlign: "middle",
    margin: "6px 5px 0 0"
  },
  invitation: {
    padding: "3em",
    maxWidth: "30em",
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative",
    minHeight: "100%",
    "& h1": {
      fontWeight: 300,
      margin: 0,
      lineHeight: 1.1
    },
    "& h2": {
      fontWeight: 300,
      fontSize: "1.2em",
      margin: 0
    },
    "& p": {
      lineHeight: "1.4em",
      fontSize: "1.1em"
    },
    "& b": {
      fontWeight: 600
    },
    "& a": {
      color: theme.palette.primary["500"],
      textDecoration: "none",
      fontWeight: 600
    }
  },
  instruction: {
    extend: "invitation"
  },
  avatar: {
    display: "inline-block",
    height: "30px",
    margin: "-.2em 0 0 .5em",
    verticalAlign: "middle",
    width: "30px"
  },
  submitButton: {
    background: theme.palette.background.first,
    margin: "1em 0",
    "&:hover": {
      background: Color(theme.palette.background.first)
        .darken(0.2)
        .string()
    }
  },
  inputInkbar: {
    "&:after": {
      backgroundColor: theme.palette.primary[500]
    }
  },
  labelShrink: {
    color: theme.palette.primary[500]
  }
});

class Subscribe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      fetching: false,
      error: false
    };
  }

  componentDidMount() {
    if (typeof window.gtag === `function`) {
      window.gtag("config", "UA-82862651-1", { page_path: "/subs" });
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    this.setState({
      fetching: true
    });

    var params = {
      email: this.state.email,
      formid: "1",
      _nonce: "d1b3e2f10d"
    };

    var formData = new FormData();
    for (var k in params) {
      formData.append(k, params[k]);
    }

    var request = {
      method: "post",
      body: formData
    };

    fetch("https://subscription.lazywill.com/mailster/subscribe", request)
      .then(resp => resp.json())
      .then(data => {
        this.setState({
          fetching: false
        });

        let subscriptionConfirmed = false;
        if (
          data.fields &&
          data.fields.email &&
          data.fields.email === "You are already registered" &&
          !data.fields.confirmation
        ) {
          subscriptionConfirmed = true;
        }

        this.props.updateSubscription(true, subscriptionConfirmed);

        if (typeof window.gtag === `function`) {
          window.gtag("event", "newsletter_sign_up", {
            event_category: "engagement",
            event_label: "success"
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: true,
          fetching: false
        });

        if (typeof window.gtag === `function`) {
          window.gtag("event", "newsletter_sign_up", {
            event_category: "engagement",
            event_label: "error"
          });
        }
      });
  };

  handleSwipe() {
    this.props.history.push("/browse");
  }

  render() {
    const { classes, subscription, subscriptionConfirmed } = this.props;
    const { fetching, error } = this.state;

    return (
      <div className={classes.root}>
        {!subscription &&
          !fetching &&
          !error && (
            <div className={classes.invitation}>
              <h2>Subscribe to</h2>
              <h1>
                <span className={classes.logo}>
                  <SvgEl svg={LOGOS.MAIN} />
                </span>
                Newsletter
              </h1>
              <p>Do you like what you{`'`}ve seen?</p>
              <p>
                Unfortunately, that{`'`}s all what I can show you for now. The app is still in
                development.{" "}
              </p>
              <p>Subscribe to the Newsletter and I will inform your about the progress of work.</p>
              <p>Do not miss your chance to try out the app as one of the firsts.</p>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  onChange={this.handleChange("email")}
                  label="e-mail address"
                  value={this.state.email}
                  type="email"
                  required={true}
                  fullWidth
                  InputProps={{
                    classes: {
                      inkbar: classes.inputInkbar
                    }
                  }}
                  InputLabelProps={{
                    classes: {
                      shrink: classes.labelShrink
                    }
                  }}
                />
                <BlockButton
                  type="submit"
                  classes={{
                    root: classes.submitButton
                  }}
                >
                  Subscribe
                </BlockButton>
              </form>
            </div>
          )}
        {subscription &&
          !subscriptionConfirmed && (
            <div className={classes.instruction}>
              <h1>Confirm your subscription</h1>
              <p>We have sent you an e-mail validation message.</p>
              <p>
                Please, open your e-mail client and find a message from{" "}
                <em>Will at lazywill.com</em> with a subject{" "}
                <em>Please confirm your Newsletter subscription</em>.
              </p>
              <p>Open the message and click the confirmation link.</p>
              <p>Thank you and see you soon</p>
              <p>
                <b>Will</b>
                <span className={classes.avatar}>
                  <SvgEl svg={LOGOS.AVATAR} />
                </span>{" "}
              </p>
            </div>
          )}
        {subscription &&
          subscriptionConfirmed && (
            <div className={classes.instruction}>
              <h1>Thank you</h1>
              <p>The subscription for the given e-mail address already exists.</p>
              <p>See you soon</p>
              <p>
                <b>Will</b>
                <span className={classes.avatar}>
                  <SvgEl svg={LOGOS.AVATAR} />
                </span>{" "}
              </p>
            </div>
          )}
        {error && (
          <div className={classes.instruction}>
            <h1>Oooops...</h1>
            <p>I{`'`}m sorry, but something went wrong.</p>
            <p>Please reaload the app and try again.</p>
            <p>
              <b>Will</b>
              <span className={classes.avatar}>
                <SvgEl svg={LOGOS.AVATAR} />
              </span>{" "}
            </p>
          </div>
        )}
        {fetching && (
          <div className={classes.textBox}>
            <Loading />
          </div>
        )}
      </div>
    );
  }
}

Subscribe.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  updateSubscription: PropTypes.func.isRequired,
  subscription: PropTypes.bool.isRequired,
  subscriptionConfirmed: PropTypes.bool.isRequired
};

export default injectSheet(styles)(Subscribe);