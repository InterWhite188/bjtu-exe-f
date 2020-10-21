package com.epoch.dsk.boot.entity;

import lombok.Data;

/**
 * 用于返回统计信息的实体
 *
 * @author dangshk
 * @date 2020/08/20
 */
@Data
public class StatisticsDataBO {
    // 起始值
    private int start;
    // 结束值
    private int end;
    // 人数
    private int num;

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getEnd() {
        return end;
    }

    public void setEnd(int end) {
        this.end = end;
    }

    public int getNum() {
        return num;
    }

    public void setNum(int num) {
        this.num = num;
    }
}
