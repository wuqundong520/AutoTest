package com.dcits.util.mail;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

import org.apache.log4j.Logger;

import com.dcits.business.message.bean.TestReport;
import com.dcits.constant.SystemConsts;
import com.dcits.util.PracticalUtils;
import com.dcits.util.SettingUtil;
import com.dcits.util.StrutsUtils;

/**
 * 邮件发送工具类
 * @author xuwangcheng
 * @version 20171209,1.0.0.0
 *
 */
public class Mail {
	
	private static final Logger LOGGER = Logger.getLogger(Mail.class);
	
	public static String sendReportEmail (TestReport report) {
		String sendSuccess = "true";
		Properties props = new Properties(); 
		
		final String smtpPort = SettingUtil.getSettingValue(SystemConsts.GLOBAL_SETTING_MAIL_SERVER_PORT);
		
		props.setProperty("mail.transport.protocol", "smtp");   // 使用的协议（JavaMail规范要求）
        props.setProperty("mail.smtp.host", SettingUtil.getSettingValue(SystemConsts.GLOBAL_SETTING_MAIL_SERVER_HOST));   // 发件人的邮箱的 SMTP 服务器地址
        props.setProperty("mail.smtp.auth", "true");            // 需要请求认证
        props.setProperty("mail.smtp.port", smtpPort);
        
        /**
         * SSL连接
         */
		
        if ("0".equals(SettingUtil.getSettingValue(SystemConsts.GLOBAL_SETTING_MAIL_SSL_FLAG))) {       	
            props.setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            props.setProperty("mail.smtp.socketFactory.fallback", "false");
            props.setProperty("mail.smtp.socketFactory.port", smtpPort);
        }
        
        Session session = Session.getInstance(props);
        //session.setDebug(true);
        Transport transport = null;
        String sendAddress = SettingUtil.getSettingValue(SystemConsts.GLOBAL_SETTING_MAIL_AUTH_USERNAME);
        String receives = SettingUtil.getSettingValue(SystemConsts.GLOBAL_SETTING_MAIL_RECEIVE_ADDRESS);
        String copyers = SettingUtil.getSettingValue(SystemConsts.GLOBAL_SETTING_MAIL_COPY_ADDRESS);
        
        Address[] receiveAddresses = createAddresses(receives.split("[,，]"));
        if (receiveAddresses.length < 1) {
        	return "邮件发送失败：缺少收件人或者邮件地址不正确,请检查!";
        }
        Address[] copyAddresses = createAddresses(copyers.split("[,，]"));
        
        
        try {
			transport = session.getTransport();
		
			transport.connect(SettingUtil.getSettingValue(SystemConsts.GLOBAL_SETTING_MAIL_AUTH_USERNAME),
					SettingUtil.getSettingValue(SystemConsts.GLOBAL_SETTING_MAIL_AUTH_PASSWORD));
			MimeMessage message = createMimeMessage(session, sendAddress, receiveAddresses, copyAddresses, report);
			
			LOGGER.info("发送邮件详情：\n收件人-" + sendAddress + ",\n收件人列表-" + receives + ",\n抄送列表-" + copyers
					+ "\n邮件内容为\n" + message.getContent().toString() + "\n附件为-" + StrutsUtils.getProjectPath() + "/" + report.getReportHtmlPath());
			
	        transport.sendMessage(message, message.getAllRecipients());
	        transport.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			LOGGER.error("发送邮件失败", e);
			return "发送邮件失败:" + e.getMessage();
		}
        
        LOGGER.info("邮件发送成功!");
		return sendSuccess;
	}
	
	
	public static MimeMessage createMimeMessage(Session session, String sendAddress, 
				Address[] receiveAddresses, Address[] copyAddresses, TestReport report) throws Exception {
		MimeMessage message = new MimeMessage(session);
		message.setFrom(new InternetAddress(sendAddress, "神州数码接口自动化测试平台", "UTF-8"));		
		message.setRecipients(RecipientType.TO, receiveAddresses);
		message.setRecipients(RecipientType.CC, copyAddresses);
		
		message.setSubject("接口自动化定时任务_测试报告", "UTF-8");
		
		//添加附件
		MimeBodyPart attachment = new MimeBodyPart();
		DataHandler dh2 = new DataHandler(new FileDataSource(StrutsUtils.getProjectPath() + "/" + report.getReportHtmlPath()));
		attachment.setDataHandler(dh2);
		attachment.setFileName(MimeUtility.encodeText(dh2.getName()));
		
		//邮件内容
		MimeBodyPart text = new MimeBodyPart();
		report.setSceneNum();
		text.setContent("你好：<br>接口自动化平台在" + PracticalUtils.formatDate(PracticalUtils.FULL_DATE_PATTERN, report.getFinishTime()) 
				+ "完成一次定时测试任务。<br>本次共执行测试场景<span style=\"color:#0000FF;\">" + report.getSceneNum() + "</span>个,"
				+ "其中测试成功<span style=\"color:green;\">" + report.getSuccessNum() + "</span>个,"
				+ "测试失败<span style=\"color:red;\">" + report.getFailNum() + "</span>个,"
				+ "异常中断<span style=\"color:#848484;\">" + report.getStopNum() + "</span>个。<br>详情请参考附件中的离线测试报告!(请先从邮箱中下载在本地打开查看，否则会出现样式错误!)", "text/html;charset=UTF-8");
		
		
		
		MimeMultipart mm = new MimeMultipart();
		mm.addBodyPart(attachment);
		mm.addBodyPart(text);
		mm.setSubType("mixed");
		
		message.setContent(mm);
		message.setSentDate(new Date());
		message.saveChanges();
		
		return message;
		
	}
	
	public static Address[] createAddresses (String[] addresses) {
		List<InternetAddress> addressObjs = new ArrayList<InternetAddress>();
		InternetAddress addr = null;
		for (int i = 0; i < addresses.length; i++) {
			try {
				addr = new InternetAddress(addresses[i]);
				addressObjs.add(addr);
			} catch (AddressException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return addressObjs.toArray(new Address[0]);
	}
	
}
