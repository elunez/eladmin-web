package com.joolun.weixin.utils;

import com.joolun.weixin.constant.ConfigConstant;

import javax.servlet.http.HttpServletRequest;

/**
 * @author www.joolun.com
 * 小程序工具类
 */
public class WxMaUtil {
	/**
	 * 通过request获取appId
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String getAppId(HttpServletRequest request) {
		String appId = request.getHeader(ConfigConstant.HEADER_APP_ID);
		return appId;
	}
}
