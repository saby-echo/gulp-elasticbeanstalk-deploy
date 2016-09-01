'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Bean = exports.S3File = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _awsSdk = require('aws-sdk');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var S3File = exports.S3File = function () {

    /**
     * Models an file in an S3 bucket. This is a simpler version around a full
     * `AWS.S3` instance focused on uploads.
     *
     * @constructor S3Bucket
     * @param  {String} bucket  Name of the bucket where the file is stored
     * @param  {String} path    Path of the file inside the bucket
     *
     * @see [AWS.S3]{@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html}
     */
    function S3File(_ref) {
        var bucket = _ref.bucket;
        var path = _ref.path;
        (0, _classCallCheck3.default)(this, S3File);


        if (!bucket || typeof bucket !== 'string') throw new TypeError('Bucket Id must be a valid string');
        if (!path || typeof path !== 'string') throw new TypeError('Bucket Path must be a valid string');

        var s3bucket = new _awsSdk.S3({
            params: {
                Bucket: bucket,
                Key: path
            },
            signatureVersion: 'v4'
        });

        /**
         * Name/Id of the S3 bucket where the file is stored
         * @constant {String} S3File#bucket
         */
        Object.defineProperty(this, 'bucket', {
            value: bucket,
            enumerable: true
        });

        /**
         * Key/Path inside of the S3 bucket where the file is
         * @constant {String} S3File#path
         */
        Object.defineProperty(this, 'path', {
            value: path,
            enumerable: true
        });

        /**
         * Reference to the full AWS-SDK bucket
         * @private
         * @constant {external:AWS.S3} S3File#bucket
         */
        Object.defineProperty(this, 's3bucket', {
            value: s3bucket,
            enumerable: false
        });
    }

    /**
     * Creates the current bucket on S3.
     *
     * @async
     * @method S3File#create
     * @return {Promise}  Resolved once the action has completed
     *
     * @see [AWS.S3#createBucket]{@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property}
     */


    (0, _createClass3.default)(S3File, [{
        key: 'create',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                var _this = this;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return new _promise2.default(function (resolve, reject) {
                                    _this.s3bucket.createBucket(function (err, result) {
                                        if (err) reject(err);else resolve(result);
                                    });
                                });

                            case 2:
                                return _context.abrupt('return', _context.sent);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function create() {
                return _ref2.apply(this, arguments);
            }

            return create;
        }()

        /**
         * Prepares the provided file for being uploaded.
         * Mainly for testing propuses.
         *
         * @private
         * @async
         * @return {AWS.S3#upload()} [description]
         */

    }, {
        key: 'prepareUpload',
        value: function prepareUpload(file) {
            return this.s3bucket.upload({ Body: file.contents });
        }

        /**
         * Uploads the provided file to the current path.
         *
         * @async
         * @method S3File#upload
         * @param  {external:vinyl.File} file - The file to upload
         * @return {Promise}  Resolved once the action has completed
         *
         * @see [AWS.S3#upload]{@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property}
         */

    }, {
        key: 'upload',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(file) {
                var upload;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                upload = this.prepareUpload(file);
                                _context2.next = 3;
                                return new _promise2.default(function (resolve, reject) {
                                    upload.send(function (err, result) {
                                        if (err) reject(err);else resolve(result);
                                    });
                                });

                            case 3:
                                return _context2.abrupt('return', _context2.sent);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function upload(_x) {
                return _ref3.apply(this, arguments);
            }

            return upload;
        }()
    }]);
    return S3File;
}();

var Bean = exports.Bean = function () {

    /**
     * Models a combination of ElasticBeanstalk Application + Environment.
     * This is a simpler version around a full `AWS.ElasticBeanstalk` instance
     * focused on deployments.
     *
     * @constructor Bean
     * @param  {String} region  Identifier of the region where the elastic
     *                          beanstalk instance exists.
     * @param  {String} application  Application name
     * @param  {String} environment  Environment name
     *
     * @see [AWS.ElasticBeanstalk]{@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticBeanstalk.html}
     */
    function Bean(_ref4) {
        var region = _ref4.region;
        var application = _ref4.application;
        var environment = _ref4.environment;
        (0, _classCallCheck3.default)(this, Bean);


        if (!region || typeof region !== 'string') throw new TypeError('region must be a valid string');
        if (!application || typeof application !== 'string') throw new TypeError('application must be a valid string');
        if (!environment || typeof environment !== 'string') throw new TypeError('environment must be a valid string');

        var bean = new _awsSdk.ElasticBeanstalk({ region: region });

        /**
         * Application name
         * @constant {String} Bean#application
         */
        Object.defineProperty(this, 'application', {
            value: application,
            enumerable: true
        });

        /**
         * Environment name
         * @constant {String} Bean#environment
         */
        Object.defineProperty(this, 'environment', {
            value: environment,
            enumerable: true
        });

        /**
         * Reference to the full AWS-SDK elastic beanstalk
         * @private
         * @constant {external:AWS.ElasticBeanstalk} Bean#bean
         */
        Object.defineProperty(this, 'bean', {
            value: bean,
            enumerable: false
        });
    }

    /**
     * Creates a version with a label and a source code for the current bean.
     *
     * @async
     * @method Bean#createVersion
     * @param  {String} version Version label for the version to deploy
     * @param  {S3File} file    File containing the zipped source code of the
     *                          version stored on S3
     * @return {Promise}        Resolved once the action has completed
     * 
     * @see [AWS.ElasticBeanstalk#createVersion]{@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticBeanstalk.html#createVersion-property}
     */


    (0, _createClass3.default)(Bean, [{
        key: 'createVersion',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(version, file) {
                var _this2 = this;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return new _promise2.default(function (resolve, reject) {
                                    _this2.bean.createApplicationVersion({
                                        ApplicationName: _this2.application,
                                        VersionLabel: version,
                                        SourceBundle: {
                                            S3Bucket: file.bucket,
                                            S3Key: file.path
                                        }
                                    }, function (err, result) {
                                        if (err) reject(err);else resolve(result);
                                    });
                                });

                            case 2:
                                return _context3.abrupt('return', _context3.sent);

                            case 3:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function createVersion(_x2, _x3) {
                return _ref5.apply(this, arguments);
            }

            return createVersion;
        }()

        /**
         * Updates the current environment to the version specified.
         * The version must have been previously uploaded via
         * {@link Bean#createVersion}
         *
         * @async
         * @method Bean#update
         * @param  {String} version Version label of the version to deploy on the current bean environment
         * @return {Promise}        Resolved once the action has completed
         * 
         * @see [AWS.ElasticBeanstalk#updateEnvironment]{@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticBeanstalk.html#updateEnvironment-property}
         */

    }, {
        key: 'update',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(version) {
                var _this3 = this;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return new _promise2.default(function (resolve, reject) {
                                    _this3.bean.updateEnvironment({
                                        EnvironmentName: _this3.environment,
                                        VersionLabel: version
                                    }, function (err, result) {
                                        if (err) reject(err);else resolve(result);
                                    });
                                });

                            case 2:
                                return _context4.abrupt('return', _context4.sent);

                            case 3:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function update(_x4) {
                return _ref6.apply(this, arguments);
            }

            return update;
        }()

        /**
         * Describes the current status and health of the environment.
         *
         * @async
         * @method Bean#describeHealth
         * @see [AWS.ElasticBeanstalk#describeEnvironmentHealth]{@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticBeanstalk.html#describeEnvironmentHealth-property}
         * @return {Promise.<Object>} The environment status
         */

    }, {
        key: 'describeHealth',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
                var _this4 = this;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return new _promise2.default(function (resolve, reject) {
                                    _this4.bean.describeEnvironmentHealth({
                                        EnvironmentName: _this4.environment,
                                        AttributeNames: ['All']
                                    }, function (err, result) {
                                        if (err) reject(err);else resolve(result);
                                    });
                                });

                            case 2:
                                return _context5.abrupt('return', _context5.sent);

                            case 3:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function describeHealth() {
                return _ref7.apply(this, arguments);
            }

            return describeHealth;
        }()
    }]);
    return Bean;
}();