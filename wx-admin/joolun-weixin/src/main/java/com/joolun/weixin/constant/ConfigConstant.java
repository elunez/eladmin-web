/*
MIT License

Copyright (c) 2020 www.joolun.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
package com.joolun.weixin.constant;

/**
 * 全局常量
 * @author www.joolun.com
 * 2019年1月21日
 */
public interface ConfigConstant {
	
	//订阅状态（0：已订阅；1：未订阅；2：网页授权用户）
	/**
	 * 0：未订阅，取消订阅
	 */
	String SUBSCRIBE_TYPE_NO = "0";
	/**
	 * 1：已订阅
	 */
	String SUBSCRIBE_TYPE_YES = "1";
  	/**
  	 * 2：网页授权用户
  	 */
  	String SUBSCRIBE_TYPE_WEBLICENS = "2";

	/**
	 * 应用类型 1:小程序
	 */
	String WX_APP_TYPE_1 = "1";
	/**
	 * 应用类型 2:公众号
	 */
	String WX_APP_TYPE_2 = "2";

	/**
	 * 消息自动回复类型（1、关注时回复；2、消息回复；3、关键词回复）
	 */
	String WX_AUTO_REPLY_TYPE_1 = "1";
	String WX_AUTO_REPLY_TYPE_2 = "2";
	String WX_AUTO_REPLY_TYPE_3 = "3";

	/**
	 * 回复类型文本匹配类型（1、全匹配，2、半匹配）
	 */
	String WX_REP_MATE_1 = "1";
	String WX_REP_MATE_2 = "2";

	/**
	 * 消息分类（1、用户发给公众号；2、公众号发给用户；）
	 */
	String WX_MSG_TYPE_1 = "1";
	String WX_MSG_TYPE_2 = "2";

	/**
	 * 群发消息发送类型（1、分组发；2、选择用户发）
	 */
	String WX_MASS_SEND_TYPE_1 = "1";
	String WX_MASS_SEND_TYPE_2 = "2";

	/**
	 *  群发消息发送后的状态(SUB_SUCCESS：提交成功，SUB_FAIL：提交失败，SEND_SUCCESS：发送成功，SENDING：发送中，SEND_FAIL：发送失败，DELETE：已删除)
	 */
	String WX_MASS_STATUS_SUB_SUCCESS = "SUB_SUCCESS";
	String WX_MASS_STATUS_SUB_FAIL = "SUB_FAIL";
	String WX_MASS_STATUS_SEND_SUCCESS = "SEND_SUCCESS";
	String WX_MASS_STATUS_SENDING = "SENDING";
	String WX_MASS_STATUS_SEND_FAIL = "SEND_FAIL";
	String WX_MASS_STATUS_DELETE = "DELETE";

	/**
	 * 菜单类型(1:普通菜单，2:个性化菜单)
	 */
	String WX_MENU_TYPE_1 = "1";
	String WX_MENU_TYPE_2 = "2";

	/**
	 * header中的app-id
	 */
	String HEADER_APP_ID = "app-id";

	/**
	 * header中的third-session
	 */
	String HEADER_THIRDSESSION = "third-session";
}
