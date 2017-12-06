var BATCH_AUTO_TEST_URL = "test-scenesTest"; //批量测试   测试集或者全量
var GET_TEST_CONFIG_URL = "test-getConfig";//获取当前用户的测试配置
var UPDATE_TEST_CONFIG_URL = "test-updateConfig";//更新指定测试配置
var CHECK_DATA_URL = "test-checkHasData";//测试之前检查指定的测试集中所有的测试场景是否有足够的测试数据
var TEST_SCENE_URL = "test-sceneTest";//单场景测试

var PARAMS_GET_URL = "param-getParams"; //根据interfaceId来 获取parameters
var PARAM_SAVE_URL = "param-save";   //保存新增的接口参数
var PARAM_DEL_URL = "param-del";   //删除指定参数
var PARAM_EDIT_URL = "param-edit";  //编辑参数的指定属性
var PARAM_JSON_IMPORT_URL = "param-batchImportParams"; //导入json串
var PARAM_DEL_ALL_URL = "param-delInterfaceParams";//删除指定接口下的所有参数

var INTERFACE_LIST_URL = "interface-list"; //获取接口列表
var INTERFACE_CHECK_NAME_URL = "interface-checkName"; //检查新增接口名是否重复
var INTERFACE_EDIT_URL = "interface-edit";  //接口编辑
var INTERFACE_GET_URL = "interface-get"; //获取指定接口信息
var INTERFACE_DEL_URL = "interface-del"; //删除指定接口
var INTERFACE_IMPORT_FROM_EXCEL = "interface-importFromExcel";//从已经上传完成的excel中导入接口数据


var MESSAGE_LIST_URL = "message-list"; //获取报文列表
var MESSAGE_EDIT_URL = "message-edit";  //报文信息编辑
var MESSAGE_GET_URL = "message-get"; //获取指定报文信息
var MESSAGE_DEL_URL = "message-del"; //删除指定报文
var MESSAGE_FORMAT_URL = "message-format";//格式化报文串
var MESSAGE_VALIDATE_JSON_URL = "message-validateJson";//报文串验证


var SCENE_LIST_URL = "scene-list"; //获取场景列表
var SCENE_EDIT_URL = "scene-edit";  //场景编辑
var SCENE_GET_URL = "scene-get"; //获取指定场景信息
var SCENE_DEL_URL = "scene-del"; //删除指定场景
var SCENE_GET_TEST_OBJECT_URL = "scene-getTestObject"; //获取场景的测试数据和测试地址
var SCENE_LIST_NO_DATA_SCENES_URL = "scene-listNoDataScenes"; //获取指定测试集中没有测试数据的测试场景列表


var GET_SETTING_DATA_URL = "data-getSettingData"; //获取当前场景所属报文的所有可编辑入参节点 包含其他信息
var IMPORT_DATA_VALUES_URL = "data-importDatas";//批量导入测试数据
var DATA_LIST_URL = "data-list"; //获取指定测试场景数据列表
var DATA_EDIT_URL = "data-edit";  //测试数据编辑
var DATA_GET_URL = "data-get"; //获取指定测试数据信息
var DATA_DEL_URL = "data-del"; //删除指定测试数据
var DATA_CHECK_NAME_URL = "data-checkName"; //验证数据标记是否重复
var GET_SETTING_DATA_URL = "data-getSettingData";//获取设置参数数据时需要用到的相关数据
var CREATE_NEW_DATA_MSG_URL = "data-createDataMsg";//根据传入的json数据字符串和场景id生成新得带有数据的报文


var REPORT_LIST_URL = "report-list";//测试报告列表
var REPORT_GET_URL = "report-get";//获取指定测试报告信息
var REPORT_DEL_URL = "report-del";//删除指定测试报告
var REPORT_DOWNLOAD_STATIS_HTML = "report-generateStaticReportHtml";//获取静态测试报告路径（不存在就后台执行生成）
var REPORT_GET_DETAILS_URL = "report-getReportDetail";//获取生成完整测试报告所需数据

var RESULT_LIST_URL = "result-list";//获取测试结果列表
var RESULT_GET_URL = "result-get";//获取指定测试结果详情信息


var SET_OP_SCENE_URL = "set-opScene";//操作测试场景，添加到测试集或者从测试集删除
var LIST_MY_SETS_URL = "set-getMySet";//获取测试集列表
var SET_SCENE_LIST_URL = "set-listScenes";//展示存在测试集或者不存在于测试集的测试场景
var SET_LIST_URL = "set-list"; //获取测试集列表
var SET_EDIT_URL = "set-edit";  //测试集信息编辑
var SET_GET_URL = "set-get"; //获取指定测试集信息
var SET_DEL_URL = "set-del"; //删除指定测试集
var SET_NAME_CHECK_URL = "set-checkName"; //验证测试集名称是否重复
var SET_RUN_SETTING_CONFIG_URL = "set-settingConfig";//配置测试集运行时配置


//组合场景
var COMPLEX_SET_SCENE_EDIT_VARIABLES = "set-editComplexSceneVariables";//更新组合场景变量信息
var COMPLEX_SET_SCENE_LIST_URL = "set-listComplexScenes"; //获取场景列表
var COMPLEX_SET_SCENE_EDIT_URL = "set-editComplexScene";  //场景编辑
var COMPLEX_SET_SCENE_GET_URL = "set-getComplexScene"; //获取指定场景信息
var COMPLEX_SET_SCENE_DEL_URL = "set-delComplexScene"; //删除指定场景

var VALIDATE_GET_URL = "validate-getValidate";//获取指定测试场景的验证规则(只限全文验证和边界验证)
var VALIDATE_FULL_EDIT_URL = "validate-validateFullEdit";//全文验证规则更新
var VALIDATE_RULE_LIST_URL = "validate-getValidates"; //获取验证规则列表
var VALIDATE_RULE_EDIT_URL = "validate-edit";//新增或者编辑验证规则
var VALIDATE_RULE_GET_URL = "validate-get";//获取指定验证规则信息
var VALIDATE_RULE_DEL_URL = "validate-del";//删除指定验证规则
var VALIDATE_FULL_RULE_GET_URL = "validate-getValidate";//获取全文验证规则
var VALIDATE_RULE_UPDATE_STATUS = "validate-updateValidateStatus";//更新验证规则状态

var TASK_CHECK_NAME_URL = "task-checkName";//验证测试任务是否重名
var TASK_EDIT_URL = "task-edit";//编辑定时任务
var TASK_DEL_URL = "task-del";//删除指定定时任务
var TASK_LIST_URL = "task-list";//定时任务列表
var TASK_GET_URL = "task-get";//获取指定定时任务列表
var TASK_STOP_TASK_URL = "task-stopRunningTask";//停止运行中的定时任务
var TASK_ADD_RUNABLE_TASK_URL = "task-startRunableTask";//运行可运行的定时任务
var TASK_START_QUARTZ_URL = "task-startQuartz";//开启quartz定时器
var TASK_STOP_QUARTZ_URL = "task-stopQuartz";//停止quartz定时器
var TASK_GET_QUARTZ_STATUS_URL = "task-getQuartzStatus";//获取quartz定时器当前的状态
var TASK_UPDATE_CRON_EXPRESSION_URL = "task-updateCronExpression";//更新定时规则

var GLOBAL_SETTING_EDIT_URL = "global-edit";//全局配置编辑
var GLOBAL_SETTING_LIST_ALL_URL = "global-listAll";//获取全部的全局配置

var OP_INTERFACE_LIST_URL = "op-listOp"; //操作接口列表

var QUERY_DB_LINK_TEST_URL = "db-testDB";//测试指定查询数据库是否可连接
var QUERY_DB_DEL_URL = "db-del";//删除指定查询数据库信息
var QUERY_DB_LIST_URL = "db-list"//查询数据库列表
var QUERY_DB_EDIT_URL = "db-edit"//编辑指定查询数据库信息
var QUERY_DB_GET_URL = "db-get";//获取指定查询数据库信息
var QUERY_DB_LIST_ALL_URL = "db-listAll";//获取所有当前可用的查询数据数据信息


var MAIL_LIST_URL = "mail-list";//信息列表
var MAIL_DEL_URL = "mail-del";//删除信息
var MAIL_CHANGE_STATUS = "mail-changeStatus";//改变已读状态

var ROLE_DEL_URL = "role-del";//删除指定角色信息
var ROLE_GET_NODES_DETAILS_URL = "role-getNodes";//获取当前所有操作接口，并标记哪些是当前角色拥有的
var ROLE_EDIT_URL = "role-edit";//编辑指定角色信息
var ROLE_LIST_URL = "role-list";//角色信息列表
var ROLE_GET_URL = "role-get";//指定角色信息
var ROLE_UPDATE_POWER_URL = "role-updateRolePower";//更新操作接口与角色之间的关系（角色的权限信息）
var ROLE_LIST_ALL_URL = "role-listAll";//展示所有角色

var USER_LIST_URL = "user-list";//用户列表
var USER_LOCK_URL = "user-lock";//锁定用户或者解锁用户
var USER_GET_URL = "user-get";//获取用户信息
var USER_EDIT_URL = "user-edit";//编辑用户信息
var USER_RESET_PASSWD_URL = "user-resetPwd";//重置指定用户的密码为111111


var GLOBAL_VARIABLE_LIST_URL = "variable-listAll";
var GLOBAL_VARIABLE_EDIT_URL = "variable-edit";
var GLOBAL_VARIABLE_DEL_URL = "variable-del";
var GLOBAL_VARIABLE_GET_URL = "variable-get";
var GLOBAL_VARIABLE_CHECK_NAME_URL = "variable-checkName";
var GLOBAL_VARIABLE_UPDATE_VALUE_URL = "variable-updateValue";
var GLOBAL_VARIABLE_CREATE_VARIABLE_URL = "variable-createVariable";

var UPLOAD_FILE_URL = "upload-upload";//上传文件
