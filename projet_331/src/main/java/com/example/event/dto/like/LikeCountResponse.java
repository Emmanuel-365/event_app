
package com.example.event.dto.like;

public class LikeCountResponse {
    private long count;

    public LikeCountResponse(long count) {
        this.count = count;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}
