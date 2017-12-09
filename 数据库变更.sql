2017-12-8

INSERT INTO `atp`.`at_operation_interface` (`op_name`, `call_name`, `is_parent`, `mark`, `status`, `parent_op_id`) VALUES ('从excel导入数据', 'interface-importFromExcel', 'false', '从上传的Excel中导入接口信息数据', '0', '3');
INSERT INTO `atp`.`at_operation_interface` (`op_name`, `call_name`, `is_parent`, `mark`, `status`, `parent_op_id`) VALUES ('从excel导入数据', 'message-importFromExcel', 'false', '从上传的Excel中导入报文信息数据', '0', '6');
INSERT INTO `atp`.`at_operation_interface` (`op_name`, `call_name`, `is_parent`, `mark`, `status`, `parent_op_id`) VALUES ('从excel导入数据', 'scene-importFromExcel', 'false', '从上传的Excel中导入测试场景信息数据', '0', '7');
NSERT INTO `atp`.`at_operation_interface` (`op_name`, `call_name`, `is_parent`, `mark`, `status`, `parent_op_id`) VALUES ('获取指定参数信息', 'param-get', 'false', '获取指定参数信息', '0', '5');
ALTER TABLE `at_interface_info` 	ADD COLUMN `mark` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci' AFTER `last_modify_user`;
ALTER TABLE `at_parameter`    ADD COLUMN `mark` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci' AFTER `type`;
delete from at_global_variable where variable_type='httpCallParameter';

ALTER TABLE `at_global_setting`
	CHANGE COLUMN `default_value` `default_value` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci' AFTER `setting_name`,
	CHANGE COLUMN `setting_value` `setting_value` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci' AFTER `default_value`;
	
INSERT INTO `at_global_setting` (`setting_name`, `default_value`, `setting_value`, `mark`) VALUES ('sendReportMail', '1', NULL, '开启邮件通知-0为开启,1为关闭');
INSERT INTO `at_global_setting` (`setting_name`, `default_value`, `setting_value`, `mark`) VALUES ('mailUsername', NULL, NULL, '邮箱登录用户名');
INSERT INTO `at_global_setting` (`setting_name`, `default_value`, `setting_value`, `mark`) VALUES ('mailPassword', NULL, NULL, '邮箱登录密码');
INSERT INTO `at_global_setting` (`setting_name`, `default_value`, `setting_value`, `mark`) VALUES ('mailHost', NULL, NULL, '邮箱服务器地址');
INSERT INTO `at_global_setting` (`setting_name`, `default_value`, `setting_value`, `mark`) VALUES ('mailPort', '25', '345', '邮箱服务器端口');
INSERT INTO `at_global_setting` (`setting_name`, `default_value`, `setting_value`, `mark`) VALUES ('mailReceiveAddress', NULL, NULL, '收件人邮箱列表,逗号分隔');
INSERT INTO `at_global_setting` (`setting_name`, `default_value`, `setting_value`, `mark`) VALUES ('mailCopyAddress', NULL, NULL, '抄送人邮箱列表,逗号分隔');
INSERT INTO `at_global_setting` (`setting_name`, `default_value`, `setting_value`, `mark`) VALUES ('mailSSL', '1', NULL, '是否启用SSL连接,0为启用,1为不启用');
