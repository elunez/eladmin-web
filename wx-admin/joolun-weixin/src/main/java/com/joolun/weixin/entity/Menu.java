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

import cn.hutool.json.JSONUtil;
import lombok.Data;
import me.chanjar.weixin.common.bean.menu.WxMenuRule;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 自定义菜单模型
 *
 * @author www.joolun.com
 */
@Data
public class Menu implements Serializable {
  private static final long serialVersionUID = -7083914585539687746L;

  private List<MenuButton> button = new ArrayList<>();

  private WxMenuRule matchrule;

  /**
   * 反序列化
   */
  public static Menu fromJson(String json) {
	  return JSONUtil.parseObj(json).toBean(Menu.class);
  }

  public String toJson() {
    return JSONUtil.toJsonStr(this);
  }

  @Override
  public String toString() {
    return this.toJson();
  }

}
