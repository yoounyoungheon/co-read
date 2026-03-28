# coturn 구축 가이드

이 문서는 현재 프로젝트에서 coturn 서버를 같은 GCP VM 위에 signaling 서버와 함께 올린 구성을 정리한다.

대상 파일:

- `signaling/docker-compose.yml`
- `web/src/app/shared/rtc/useRtc.tsx`

현재 구성 기준:

- coturn 이미지: `coturn/coturn:latest`
- 배포 위치: GCP VM
- 외부 IP: `8.229.223.216`
- realm: `iamyounghun.site`
- 계정: `iddyoon / iddyoon`
- listening port: `3478`
- relay port range: `49160-49200`

## 1. 왜 coturn이 필요한가

WebRTC는 가능한 경우 브라우저 간 직접 연결을 시도한다.

하지만 아래 상황에서는 직접 연결이 실패할 수 있다.

- NAT 환경이 복잡한 경우
- 대칭 NAT
- 회사/학교 네트워크
- 모바일 네트워크
- 방화벽 정책이 강한 환경

이때 TURN 서버가 media relay 역할을 맡는다.  
즉 coturn은 브라우저가 직접 연결되지 않을 때 중간에서 RTP/RTCP를 대신 중계해주는 서버다.

또 coturn은 STUN 기능도 함께 제공할 수 있다.  
그래서 현재 프로젝트는 하나의 coturn 서버를 `STUN + TURN` 용도로 같이 사용한다.

## 2. 현재 프로젝트에서의 역할

현재 RTC 구조에서 역할 분리는 이렇다.

- signaling 서버
  - room participant 목록 관리
  - offer / answer / ICE candidate relay
- coturn 서버
  - STUN candidate 제공
  - TURN relay 제공
- 프론트 `useRtc`
  - `RTCPeerConnection` 생성
  - ICE 서버 설정 사용
  - signaling 서버와 coturn을 함께 이용

즉 coturn은 signaling 서버를 대체하지 않는다.  
signaling과 TURN은 역할이 다르다.

## 3. docker-compose 구성

현재 coturn은 `signaling/docker-compose.yml` 안에서 signaling 서버와 같이 실행한다.

```yaml
version: "3.3"

services:
  signaling:
    image: yoonyounghun/signaling:latest
    container_name: signaling
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      PORT: "8080"
      CLIENT_ORIGINS: "https://iamyounghun.site,http://localhost:3000"

  coturn:
    image: coturn/coturn:latest
    container_name: coturn
    restart: unless-stopped
    network_mode: host
    command: >
      -n
      --log-file=stdout
      --lt-cred-mech
      --fingerprint
      --realm=iamyounghun.site
      --server-name=iamyounghun.site
      --user=iddyoon:iddyoon
      --external-ip=8.229.223.216
      --listening-port=3478
      --min-port=49160
      --max-port=49200
```

## 4. 각 옵션 의미

### `network_mode: host`

coturn은 relay 포트 범위를 넓게 사용하므로 host network 모드가 운영이 단순하다.

장점:

- UDP relay 포트 노출이 쉬움
- TURN 특성상 포트 매핑 문제를 줄일 수 있음

단점:

- 컨테이너 네트워크 격리가 줄어듦
- VM 포트와 직접 충돌할 수 있음

### `-n`

별도 설정 파일 없이 command 인자로 실행한다는 의미다.

### `--lt-cred-mech`

long-term credential 메커니즘을 사용한다.  
즉 username / password 기반 TURN 인증을 켠다.

### `--fingerprint`

STUN/TURN 패킷 fingerprint를 사용한다.

### `--realm`

TURN 인증 영역 이름이다.  
보통 도메인명을 넣는다.

현재 값:

```text
iamyounghun.site
```

### `--server-name`

서버 식별용 이름이다. 현재는 도메인과 동일하게 두고 있다.

### `--user=iddyoon:iddyoon`

정적 사용자 계정이다.

- username: `iddyoon`
- password: `iddyoon`

이 값은 프론트 `RTC_CONFIGURATION`과 반드시 같아야 한다.

### `--external-ip=8.229.223.216`

VM의 공인 IP다.  
TURN 서버가 외부에서 보이는 주소를 정확히 알려주기 위해 필요하다.

### `--listening-port=3478`

STUN/TURN 기본 포트다.

### `--min-port=49160`, `--max-port=49200`

relay에 사용할 UDP 포트 범위다.  
media relay가 필요할 때 이 범위 안에서 포트를 할당한다.

## 5. GCP 방화벽 열기

이 명령은 VM 안이 아니라 Cloud Shell 또는 로컬 gcloud 환경에서 실행한다.

3478 TCP:

```bash
gcloud compute firewall-rules create allow-coturn-3478-tcp \
  --allow=tcp:3478 \
  --target-tags=signaling-server
```

3478 UDP:

```bash
gcloud compute firewall-rules create allow-coturn-3478-udp \
  --allow=udp:3478 \
  --target-tags=signaling-server
```

relay UDP 포트 범위:

```bash
gcloud compute firewall-rules create allow-coturn-relay-udp \
  --allow=udp:49160-49200 \
  --target-tags=signaling-server
```

확인:

```bash
gcloud compute firewall-rules list --filter="name~'allow-coturn'"
```

## 6. 프론트 `useRtc` 설정

현재 프론트는 `web/src/app/shared/rtc/useRtc.tsx`에서 coturn 정보를 아래처럼 사용한다.

```ts
const RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:8.229.223.216:3478", "turn:8.229.223.216:3478"],
      username: "iddyoon",
      credential: "iddyoon",
    },
  ],
};
```

의미:

- `stun:8.229.223.216:3478`
  - public candidate 확보용
- `turn:8.229.223.216:3478`
  - direct connection 실패 시 relay 용

즉 coturn이 STUN/TURN 둘 다 제공하도록 구성한 상태다.

## 7. 컨테이너 실행과 재시작

실행:

```bash
docker compose up -d
```

재시작:

```bash
docker compose restart coturn
```

전체 재시작:

```bash
docker compose restart
```

상태 확인:

```bash
docker compose ps
```

로그 확인:

```bash
docker compose logs -f coturn
```

## 8. 정상 로그 예시

정상적으로 올라오면 대략 아래와 비슷한 로그가 나온다.

```text
coturn  | 0: (20): DEBUG: turn server id=1 created
coturn  | 0: (1): INFO: Total auth threads: 3
coturn  | 0: (1): INFO: prometheus collector disabled, not started
```

이건 startup 자체는 성공했다는 의미다.  
다만 실제 STUN/TURN이 외부에서 동작하는지는 별도 테스트가 필요하다.

## 9. 동작 확인 방법

### 1. 서버 포트 확인

VM 안에서:

```bash
sudo ss -tulpn | grep 3478
sudo ss -uapn | grep 49160
```

### 2. coturn 테스트 유틸 사용

필요하면 VM에 `coturn` 패키지를 설치해서 테스트할 수 있다.

```bash
sudo apt update
sudo apt install -y coturn
```

테스트:

```bash
turnutils_uclient -u iddyoon -w iddyoon 8.229.223.216
```

TCP 테스트:

```bash
turnutils_uclient -t -u iddyoon -w iddyoon 8.229.223.216
```

### 3. 브라우저에서 ICE candidate 확인

브라우저 기반 확인 방법:

- `chrome://webrtc-internals`
- Trickle ICE 테스트 페이지

설정 값:

- STUN: `stun:8.229.223.216:3478`
- TURN: `turn:8.229.223.216:3478`
- username: `iddyoon`
- credential: `iddyoon`

결과 해석:

- `srflx` candidate가 나오면 STUN 응답 정상
- `relay` candidate가 나오면 TURN 응답 정상

## 10. 현재 구조의 장점

- signaling과 coturn을 같은 VM에 두어 운영이 단순하다.
- 최대 10명 수준의 소규모 서비스에서는 현실적인 시작점이다.
- Docker Compose로 signaling/coturn을 함께 관리할 수 있다.

## 11. 현재 구조의 주의사항

- 정적 credential을 프론트에 직접 두고 있다.
- 공인 IP가 바뀌면 `external-ip`, `useRtc` 설정을 같이 바꿔야 한다.
- 운영 트래픽이 늘면 TURN relay 대역폭 비용이 커질 수 있다.
- host network 모드를 쓰므로 포트 관리에 주의해야 한다.

## 12. 다음 개선 포인트

운영 품질을 높이려면 아래를 고려한다.

1. TURN credential을 정적 값에서 분리
2. 도메인 기반 `turn:` 또는 `turns:` 적용
3. TLS TURN(`5349`) 추가
4. relay 포트 범위와 모니터링 강화
5. coturn 전용 VM 또는 별도 분리
