package com.epoch.dsk.boot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author dangshk
 * @date 2020/7/30
 */

//boot启动类
@SpringBootApplication
@MapperScan("com.epoch.dsk.boot.dao.mapper")
public class BtuApplication {

    public static void main(String[] args) {
        SpringApplication.run(BtuApplication.class, args);
    }

}
