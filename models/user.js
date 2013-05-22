// Generated by CoffeeScript 1.4.0
(function() {
  var Api, EventEmitter, User, base64, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  if ((_ref = window.zooniverse) == null) {
    window.zooniverse = {};
  }

  if ((_ref1 = (_base = window.zooniverse).models) == null) {
    _base.models = {};
  }

  EventEmitter = window.zooniverse.EventEmitter || require('../lib/event-emitter');

  Api = window.zooniverse.Api || require('../lib/api');

  base64 = window.base64 || (require('../vendor/base64'), window.base64);

  User = (function(_super) {

    __extends(User, _super);

    User.current = false;

    User.path = function() {
      if (Api.current.project) {
        return "/projects/" + Api.current.project;
      } else {
        return '';
      }
    };

    User.fetch = function() {
      var fetcher, _ref2;
      User.trigger('fetching', arguments);
      fetcher = (_ref2 = Api.current).getJSON.apply(_ref2, ["" + (User.path()) + "/current_user"].concat(__slice.call(arguments)));
      fetcher.always(User.onFetch);
      return fetcher;
    };

    User.login = function(_arg) {
      var login, password, username, _ref2;
      username = _arg.username, password = _arg.password;
      this.trigger('logging-in', arguments);
      login = (_ref2 = Api.current).getJSON.apply(_ref2, ["" + (this.path()) + "/login"].concat(__slice.call(arguments)));
      login.done(this.onFetch);
      login.fail(this.onFail);
      return login;
    };

    User.logout = function() {
      var logout, _ref2;
      this.trigger('logging-out', arguments);
      logout = (_ref2 = Api.current).getJSON.apply(_ref2, ["" + (this.path()) + "/logout"].concat(__slice.call(arguments)));
      logout.always(this.onFetch);
      return logout;
    };

    User.signup = function(_arg) {
      var email, password, signup, username, _ref2;
      username = _arg.username, password = _arg.password, email = _arg.email;
      this.trigger('signing-up');
      signup = (_ref2 = Api.current).getJSON.apply(_ref2, ["" + (this.path()) + "/signup"].concat(__slice.call(arguments)));
      signup.always(this.onFetch);
      return signup;
    };

    User.onFetch = function(result) {
      var auth, original;
      original = User.current;
      if (result.success && 'name' in result && 'api_key' in result) {
        User.current = new User(result);
      } else {
        User.current = null;
      }
      if (User.current) {
        auth = base64.encode("" + User.current.name + ":" + User.current.api_key);
        Api.current.headers['Authorization'] = "Basic " + auth;
      } else {
        delete Api.current.headers['Authorization'];
      }
      if (User.current !== original) {
        if (original) {
          original.destroy();
        }
        User.trigger('change', [User.current]);
      }
      if (!result.success) {
        return User.trigger('sign-in-error', result.message);
      }
    };

    User.onFail = function() {
      return User.trigger('sign-in-failure');
    };

    User.prototype.id = '';

    User.prototype.zooniverse_id = '';

    User.prototype.api_key = '';

    User.prototype.name = '';

    User.prototype.avatar = '';

    User.prototype.project = null;

    function User(params) {
      var property, value;
      if (params == null) {
        params = {};
      }
      for (property in params) {
        if (!__hasProp.call(params, property)) continue;
        value = params[property];
        this[property] = value;
      }
    }

    User.prototype.setPreference = function(key, value, project, callback) {
      var projectSegment, _ref2;
      if (project == null) {
        project = true;
      }
      if (typeof project === 'function') {
        _ref2 = [true, project], project = _ref2[0], callback = _ref2[1];
      }
      projectSegment = project ? "/projects/" + Api.current.project : "";
      return Api.current.put("" + projectSegment + "/users/preferences", {
        key: key,
        value: value
      }, callback);
    };

    return User;

  }).call(this, EventEmitter);

  window.zooniverse.models.User = User;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = User;
  }

}).call(this);
