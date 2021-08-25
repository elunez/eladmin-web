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
package com.joolun.weixin.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joolun.weixin.config.CommonConstants;
import com.joolun.weixin.mapper.WxMenuMapper;
import com.joolun.weixin.service.WxMenuService;
import com.joolun.weixin.entity.*;
import lombok.AllArgsConstructor;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

/**
 * 自定义菜单
 *
 * @author www.joolun.com
 * @date 2019-03-27 16:52:10
 */
@Service
@AllArgsConstructor
public class WxMenuServiceImpl extends ServiceImpl<WxMenuMapper, WxMenu> implements WxMenuService {
	private final WxMpService wxService;
	/***
	 * 获取WxApp下的菜单树结构
	 * @return
	 */
	@Override
	public String getWxMenuButton() {
		//查出一级菜单
		List<WxMenu> listWxMenu = baseMapper.selectList(Wrappers
				.<WxMenu>query().lambda()
				.eq(WxMenu::getParentId, CommonConstants.PARENT_ID).orderByAsc(WxMenu::getSort));
		Menu menu = new Menu();
		List<MenuButton> listMenuButton = new ArrayList<>();
		MenuButton menuButton;
		List<MenuButton> subButtons;
		MenuButton subButton;
		if(listWxMenu!=null&&listWxMenu.size()>0){
			for(WxMenu wxMenu : listWxMenu){
				menuButton = new MenuButton();
				menuButton.setName(wxMenu.getName());
				String type = wxMenu.getType();
				if(StringUtils.isNotBlank(type)){//无二级菜单
					menuButton.setType(type);
					setButtonValue(menuButton,wxMenu);
				}else{//有二级菜单
					//查出二级菜单
					List<WxMenu> listWxMenu1 = baseMapper.selectList(Wrappers
							.<WxMenu>query().lambda()
							.eq(WxMenu::getParentId,wxMenu.getId()).orderByAsc(WxMenu::getSort));
					subButtons = new ArrayList<>();
					for(WxMenu wxMenu1 : listWxMenu1){
						subButton = new MenuButton();
						String type1 = wxMenu1.getType();
						subButton.setName(wxMenu1.getName());
						subButton.setType(type1);
						setButtonValue(subButton,wxMenu1);
						subButtons.add(subButton);
					}
					menuButton.setSub_button(subButtons);
				}
				listMenuButton.add(menuButton);
			}
		}
		menu.setButton(listMenuButton);
		return menu.toString();
	}

	void setButtonValue(MenuButton menuButton,WxMenu wxMenu){
		menuButton.setKey(wxMenu.getId());
		menuButton.setUrl(wxMenu.getUrl());
		menuButton.setContent(wxMenu.getContent());
		menuButton.setRepContent(wxMenu.getRepContent());
		menuButton.setMedia_id(wxMenu.getRepMediaId());
		menuButton.setRepType(wxMenu.getRepType());
		menuButton.setRepName(wxMenu.getRepName());
		menuButton.setAppid(wxMenu.getMaAppId());
		menuButton.setPagepath(wxMenu.getMaPagePath());
		menuButton.setUrl(wxMenu.getUrl());
		menuButton.setRepUrl(wxMenu.getRepUrl());
		menuButton.setRepHqUrl(wxMenu.getRepHqUrl());
		menuButton.setRepDesc(wxMenu.getRepDesc());
		menuButton.setRepThumbMediaId(wxMenu.getRepThumbMediaId());
		menuButton.setRepThumbUrl(wxMenu.getRepThumbUrl());
	}
	/**
	 * 保存并发布菜单
	 * @param
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveAndRelease(String strWxMenu) throws WxErrorException {
		Menu menu = Menu.fromJson(strWxMenu);
		List<MenuButton> buttons = menu.getButton();
		//先删除
		baseMapper.delete(Wrappers
				.<WxMenu>query().lambda());
		WxMenu wxMenu = null;
		WxMenu wxMenu1 = null;
		int sort1 = 1;
		int sort2 = 1;
		//入库
		for(MenuButton menuButton : buttons){
			wxMenu = new WxMenu();
			setWxMenuValue(wxMenu,menuButton);
			wxMenu.setSort(sort1);
			wxMenu.setParentId(CommonConstants.PARENT_ID);
			baseMapper.insert(wxMenu);
			menuButton.setKey(wxMenu.getId());
			sort1++;
			for(MenuButton menuButton1 : menuButton.getSub_button()){
				wxMenu1 = new WxMenu();
				setWxMenuValue(wxMenu1,menuButton1);
				wxMenu1.setSort(sort2);
				wxMenu1.setParentId(wxMenu.getId());
				baseMapper.insert(wxMenu1);
				menuButton1.setKey(wxMenu1.getId());
				sort2++;
			}
		}
		//创建菜单
		wxService.getMenuService().menuCreate(menu.toString());
	}

	void setWxMenuValue(WxMenu wxMenu,MenuButton menuButton){
		wxMenu.setId(menuButton.getKey());
		wxMenu.setType(menuButton.getType());
		wxMenu.setName(menuButton.getName());
		wxMenu.setUrl(menuButton.getUrl());
		wxMenu.setRepMediaId(menuButton.getMedia_id());
		wxMenu.setRepType(menuButton.getRepType());
		wxMenu.setRepName(menuButton.getRepName());
		wxMenu.setMaAppId(menuButton.getAppid());
		wxMenu.setMaPagePath(menuButton.getPagepath());
		wxMenu.setRepContent(menuButton.getRepContent());
		wxMenu.setContent(menuButton.getContent());
		wxMenu.setRepUrl(menuButton.getRepUrl());
		wxMenu.setRepHqUrl(menuButton.getRepHqUrl());
		wxMenu.setRepDesc(menuButton.getRepDesc());
		wxMenu.setRepThumbMediaId(menuButton.getRepThumbMediaId());
		wxMenu.setRepThumbUrl(menuButton.getRepThumbUrl());
		menuButton.setRepUrl(null);
		menuButton.setRepDesc(null);
		menuButton.setRepHqUrl(null);
		menuButton.setContent(null);
		menuButton.setRepContent(null);
		menuButton.setRepType(null);
		menuButton.setRepName(null);
		menuButton.setRepThumbMediaId(null);
		menuButton.setRepThumbUrl(null);
	}
}
