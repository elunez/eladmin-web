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
package com.joolun.weixin.entity;

import cn.hutool.json.JSONObject;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 自定义菜单模型
 *
 * @author www.joolun.com
 */
@Data
public class MenuButton implements Serializable {

	private String type;

	private String name;

	private String key;

	private String url;

	private String media_id;

	private String appid;

	private String pagepath;

	private List<MenuButton> sub_button = new ArrayList();
	/**
	 * content内容
	 */
	private JSONObject content;

	private String repContent;
	/**
	 * 消息类型
	 */
	private String repType;
	/**
	 * 消息名
	 */
	private String repName;
	/**
	 * 视频和音乐的描述
	 */
	private String repDesc;
	/**
	 * 视频和音乐的描述
	 */
	private String repUrl;
	/**
	 * 高质量链接
	 */
	private String repHqUrl;
	/**
	 * 缩略图的媒体id
	 */
	private String repThumbMediaId;
	/**
	 * 缩略图url
	 */
	private String repThumbUrl;
}
