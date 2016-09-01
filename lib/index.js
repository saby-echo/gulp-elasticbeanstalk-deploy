'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deploy = exports.wait4deploy = exports.PLUGIN_NAME = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var wait4deploy = exports.wait4deploy = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(bean, logger) {
        var previousStatus = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var status;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return delay(IS_TEST ? 0 : 2000);

                    case 2:
                        _context.next = 4;
                        return bean.describeHealth();

                    case 4:
                        status = _context.sent;

                        status = (0, _lodash.omit)(status, ['ResponseMetadata', 'InstancesHealth', 'RefreshedAt']);

                        if (previousStatus && !(0, _lodash.isEqual)(previousStatus, status)) logger(bean, previousStatus, status);

                        if (!(status.Status !== 'Ready')) {
                            _context.next = 13;
                            break;
                        }

                        _context.next = 10;
                        return wait4deploy(bean, logger, status);

                    case 10:
                        return _context.abrupt('return', _context.sent);

                    case 13:
                        return _context.abrupt('return', status);

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function wait4deploy(_x2, _x3, _x4) {
        return _ref.apply(this, arguments);
    };
}();

var deploy = exports.deploy = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(opts, file, s3file, bean) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return s3file.upload(file);

                    case 3:
                        _context2.next = 13;
                        break;

                    case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2['catch'](0);

                        if (!(_context2.t0.code !== 'NoSuchBucket')) {
                            _context2.next = 9;
                            break;
                        }

                        throw _context2.t0;

                    case 9:
                        _context2.next = 11;
                        return s3file.create();

                    case 11:
                        _context2.next = 13;
                        return s3file.upload(file);

                    case 13:
                        _context2.next = 15;
                        return bean.createVersion(opts.versionLabel, s3file);

                    case 15:
                        _context2.next = 17;
                        return bean.update(opts.versionLabel);

                    case 17:
                        if (!opts.waitForDeploy) {
                            _context2.next = 20;
                            break;
                        }

                        _context2.next = 20;
                        return wait4deploy(bean, logBeanTransition);

                    case 20:
                        return _context2.abrupt('return', file);

                    case 21:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 5]]);
    }));

    return function deploy(_x6, _x7, _x8, _x9) {
        return _ref2.apply(this, arguments);
    };
}();

exports.delay = delay;
exports.currentDate = currentDate;
exports.logBeanTransition = logBeanTransition;
exports.buildOptions = buildOptions;
exports.default = gulpEbDeploy;

var _fs = require('fs');

var _path = require('path');

var _lodash = require('lodash');

var _gulpUtil = require('gulp-util');

var _gulpZip = require('gulp-zip');

var _gulpZip2 = _interopRequireDefault(_gulpZip);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _plexer = require('plexer');

var _plexer2 = _interopRequireDefault(_plexer);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _leftPad = require('left-pad');

var _leftPad2 = _interopRequireDefault(_leftPad);

var _aws = require('./aws');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {};
var IS_TEST = process.env['NODE_ENV'] === 'test';

var PLUGIN_NAME = exports.PLUGIN_NAME = 'gulp-elasticbeanstalk-deploy';

/**
 * Retuns a promise that is resolved after the specified time has passed
 * @param  {Number} time Time to wait
 * @return {Promise}
 */
function delay() {
    var time = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];

    return new _promise2.default(function (resolve) {
        return setTimeout(resolve, time);
    });
}

/**
 * Returns current date formated as `YYYY.MM.DD_HH.mm.ss`
 * @return {String}
 */
function currentDate() {
    var date = new Date(),
        YYYY = (0, _leftPad2.default)(date.getFullYear()),
        MM = (0, _leftPad2.default)(date.getMonth(), 2, 0),
        DD = (0, _leftPad2.default)(date.getDate(), 2, 0),
        HH = (0, _leftPad2.default)(date.getHours(), 2, 0),
        mm = (0, _leftPad2.default)(date.getMinutes(), 2, 0),
        ss = (0, _leftPad2.default)(date.getSeconds(), 2, 0);
    return YYYY + '.' + MM + '.' + DD + '_' + HH + '.' + mm + '.' + ss;
}

/**
 * Called when a change occurs on the specified bean status. Logs a short
 * summary of the changes via `gutil.log`.
 *
 * @param  {Bean}   bean           The bean where a c
 * @param  {Object} previousStatus The result of Bean#describeHealth before
 *                                 the change occurred
 * @param  {Object} status         The result of Bean#describeHealth after
 *                                 the change occurred
 * @return {String}                The logged message
 */
function logBeanTransition(bean, previousStatus, status) {
    var _color = {
        'Green': _gulpUtil.colors.green,
        'Yellow': _gulpUtil.colors.yellow,
        'Red': _gulpUtil.colors.red,
        'Grey': _gulpUtil.colors.gray
    };

    var colorPrev = _color[previousStatus.Color] || _gulpUtil.colors.grey;
    var colorNew = _color[status.Color] || _gulpUtil.colors.grey;
    var message = 'Enviroment ' + _gulpUtil.colors.cyan(bean.environment) + ' transitioned' + (' from ' + colorPrev(previousStatus.HealthStatus) + '(' + colorPrev(previousStatus.Status) + ')') + (' to ' + colorNew(status.HealthStatus) + '(' + colorNew(status.Status) + ')');

    if (!IS_TEST) (0, _gulpUtil.log)(message);

    return message;
}

function buildOptions(opts) {

    var options = (0, _assign2.default)({}, {
        name: undefined,
        version: undefined,
        timestamp: true,
        waitForDeploy: true,
        amazon: undefined
    }, opts);

    // If no name or no version provided, try to read it from package.json
    if (!options.name || !options.version) {
        var packageJsonStr = (0, _fs.readFileSync)('./package.json', 'utf8');
        var packageJson = JSON.parse(packageJsonStr);
        if (!options.name) options.name = packageJson.name;
        if (!options.version) options.version = packageJson.version;
    }

    // Build the filename
    var versionLabel = options.version;
    if (options.timestamp !== false) versionLabel += '-' + currentDate();
    options.versionLabel = versionLabel;
    options.filename = versionLabel + '.zip';

    if (!options.amazon) throw new _gulpUtil.PluginError(PLUGIN_NAME, 'No amazon config provided');

    // if keys are provided, create new credentials, otherwise defaults will be used
    if (options.amazon.accessKeyId && options.amazon.secretAccessKey) {
        _awsSdk2.default.config.credentials = new _awsSdk2.default.Credentials({
            accessKeyId: opts.amazon.accessKeyId,
            secretAccessKey: opts.amazon.secretAccessKey
        });
    }

    return options;
}

function gulpEbDeploy(opts) {

    opts = buildOptions(opts);

    var s3file = new _aws.S3File({
        bucket: opts.amazon.bucket,
        path: (0, _path.join)(opts.name, opts.filename)
    });

    var bean = new _aws.Bean({
        region: opts.amazon.region,
        application: opts.amazon.applicationName,
        environment: opts.amazon.environmentName
    });

    var zipStream = (0, _gulpZip2.default)(opts.filename);
    var deployStream = zipStream.pipe(_through2.default.obj(function (file, enc, cb) {
        deploy(opts, file, s3file, bean).then(function (result) {
            return cb(null, result);
        }).catch(function (e) {
            return cb(e);
        });
    }));

    return _plexer2.default.obj(zipStream, deployStream);
}