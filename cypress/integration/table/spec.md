## Bubble.io 연동 플러그인

아래 postMessage로 초기화 한다.

```code
window.postMessage({
      payload: {
        user_id: '1651800183717x956761776063033100',
        start: '2021-11-05',
        end: '2022-04-05',
        metrics_type: 'SALES',
        order_by_col_num: 1,
        page:0,
        per_page:10
      },
      reset: false
    })
```

## Test Case

1. page 변화할 때마다 per_page, page params에 따른 데이터를 패치한다. 패치 결과는 SWR로 캐싱해둔다.

1-1. 캐싱 key는 payload를 직렬화(stringify)한 값으로 정한다.

1-2. 전체 rows는 mergedRows에 쌓아둔다.

1-3. 이미 패치한 key로 꺼내볼 때는 mergedRows를 이전 값으로 유지한다.

2. page를 이동하더라도 sorting, filtering을 유지한다.

3. per_page를 중간에 업데이트하는 경우, 예를 들어 "5/8 page, 페이지 당 10개 표시 -> 페이지 당 20개 표시" 인 경우에는 page를 1로 초기화 한다. mergedRows는 처음부터 다시 쌓는다.

## Bugs

1. 필터링한 상태에서 page이동시 mergedRows가 불필요하게 또 쌓임. 이 때 추가적인 api call은 없음.
