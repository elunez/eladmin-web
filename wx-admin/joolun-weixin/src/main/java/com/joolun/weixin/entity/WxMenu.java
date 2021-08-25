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
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.joolun.framework.config.typehandler.JsonTypeHandler;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.JdbcType;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 自定义菜单
 *
 * @author www.joolun.com
 * @date 2019-03-27 16:52:10
 */
@Data
@TableName("wx_menu")
@EqualsAndHashCode(callSuper = true)
public class WxMenu extends Model<WxMenu> {
private static final long serialVersionUID = 1L;

    /**
   * 菜单ID（click、scancode_push、scancode_waitmsg、pic_sysphoto、pic_photo_or_album、pic_weixin、location_select：保存key）
   */
    @TableId(type = IdType.ASSIGN_ID)
    private String id;
	/**
	 * 父菜单ID
	 */
	private String parentId;
	/**
	 * 排序值
	 */
	private Integer sort;
	/**
	 * 创建时间
	 */
	private LocalDateTime createTime;
	/**
	 * 更新时间
	 */
	private LocalDateTime updateTime;
	/**
	 * 逻辑删除标记（0：显示；1：隐藏）
	 */
	private String delFlag;
    /**
   * 菜单类型click、view、miniprogram、scancode_push、scancode_waitmsg、pic_sysphoto、pic_photo_or_album、pic_weixin、location_select、media_id、view_limited等
   */
	@NotNull(message = "菜单类型不能为空")
    private String type;
	/**
	 * 菜单名
	 */
	@NotNull(message = "菜单名不能为空")
	private String name;
    /**
   * View：保存链接到url
   */
    private String url;
    /**
   * Img、voice、News：保存mediaID
   */
    private String repMediaId;
	/**
	 * 回复消息类型（text：文本；image：图片；voice：语音；video：视频；music：音乐；news：图文）
	 */
	private String repType;
	/**
	 * 素材名、视频和音乐的标题
	 */
	private String repName;
    /**
   * Text:保存文字
   */
    private String repContent;
	/**
	 * 小程序的appid
	 */
	private String maAppId;
	/**
	 * 小程序的页面路径
	 */
	private String maPagePath;
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
	/**
	 * 图文消息的内容
	 */
	@TableField(typeHandler = JsonTypeHandler.class, jdbcType= JdbcType.VARCHAR)
	private JSONObject content;
}
