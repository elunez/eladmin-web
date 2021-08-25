package com.joolun.weixin.config;

import com.joolun.weixin.interceptor.ThirdSessionInterceptor;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * web配置
 */
@Configuration
@AllArgsConstructor
public class WebConfig implements WebMvcConfigurer {
	private final RedisTemplate redisTemplate;

	/**
	 * 拦截器
	 * @param registry
	 */
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		/**
		 * 进入ThirdSession拦截器
		 */
		registry.addInterceptor(new ThirdSessionInterceptor(redisTemplate))
				.addPathPatterns("/weixin/api/**")//拦截/api/**接口
				.excludePathPatterns("/weixin/api/ma/wxuser/login",
						"/weixin/api/ma/orderinfo/notify-order",
						"/weixin/api/ma/orderinfo/notify-logisticsr",
						"/weixin/api/ma/orderrefunds/notify-refunds");//放行接口
	}
}
