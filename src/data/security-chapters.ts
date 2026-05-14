// 보안기사 챕터별 개념 콘텐츠 데이터
// content: prose 클래스 컨테이너 안에 렌더링되는 HTML

export type Chapter = {
  subject: string;       // URL slug (system, network, ...)
  subjectLabel: string;  // 표시명
  chapter: string;       // URL slug (access-control, ...)
  chapterLabel: string;  // 표시명
  content: string;       // HTML (prose 스타일 적용됨)
  keywords: string[];    // 기출문제 필터링용 키워드 (question 필드에 포함 여부)
};

export const CHAPTERS: Chapter[] = [

  // ===== 시스템보안 =====
  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'os-security',
    chapterLabel: '운영체제 보안',
    keywords: ['umask', '파일 권한', 'setuid', 'setgid', '계정', '패스워드', '/etc/passwd', '/etc/shadow', '윈도우', '레지스트리', '감사'],
    content: `

<h3>유닉스/리눅스 파일 권한</h3>
<p>유닉스 파일 권한은 <strong>소유자(Owner) · 그룹(Group) · 기타(Others)</strong> 3단계로 구성되며,
각각 읽기(r=4) · 쓰기(w=2) · 실행(x=1) 권한을 가집니다.</p>
<pre><code>-rwxr-xr--  1 root root 1234 ...
 ↑↑↑ ↑↑↑ ↑↑↑
 소유자  그룹  기타</code></pre>

<h3>umask</h3>
<p>umask는 파일/디렉토리 생성 시 기본 권한에서 <strong>제거할 권한을 지정하는 마스크</strong>입니다.</p>
<ul>
  <li>파일 기본 권한: <code>666</code> → umask 022 적용 시 → <code>644</code></li>
  <li>디렉토리 기본 권한: <code>777</code> → umask 022 적용 시 → <code>755</code></li>
  <li>계산: 기본권한 - umask (단, AND NOT 연산이므로 단순 뺄셈이 아닌 비트 연산)</li>
</ul>
<table>
  <thead><tr><th>umask</th><th>파일 결과</th><th>디렉토리 결과</th></tr></thead>
  <tbody>
    <tr><td>022</td><td>644 (rw-r--r--)</td><td>755 (rwxr-xr-x)</td></tr>
    <tr><td>027</td><td>640 (rw-r-----)</td><td>750 (rwxr-x---)</td></tr>
    <tr><td>077</td><td>600 (rw-------)</td><td>700 (rwx------)</td></tr>
  </tbody>
</table>

<h3>특수 권한</h3>
<ul>
  <li><strong>SetUID (4000)</strong>: 실행 시 소유자 권한으로 동작. <code>rws------</code></li>
  <li><strong>SetGID (2000)</strong>: 실행 시 그룹 권한으로 동작. <code>---rws---</code></li>
  <li><strong>Sticky Bit (1000)</strong>: 디렉토리에 설정 시 소유자만 삭제 가능. <code>/tmp</code>에 사용. <code>-------rwt</code></li>
</ul>

<h3>패스워드 파일</h3>
<ul>
  <li><code>/etc/passwd</code>: 계정 정보 (누구나 읽기 가능). 형식: <code>ID:x:UID:GID:설명:홈:셸</code></li>
  <li><code>/etc/shadow</code>: 암호화된 패스워드 (root만 접근). 솔트+해시 방식 저장</li>
</ul>

<h3>윈도우 보안</h3>
<ul>
  <li><strong>레지스트리</strong>: 시스템 설정 DB. <code>HKLM</code>, <code>HKCU</code> 등 하이브로 구성</li>
  <li><strong>SAM (Security Account Manager)</strong>: 윈도우 계정/패스워드 저장소</li>
  <li><strong>감사 정책</strong>: 로그온·파일 접근·권한 사용 등 이벤트 로깅 설정</li>
  <li><strong>ACL (Access Control List)</strong>: DACL(접근 제어) + SACL(감사 제어)</li>
</ul>
    `,
  },

  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'access-control',
    chapterLabel: '접근통제',
    keywords: ['DAC', 'MAC', 'RBAC', 'Bell-LaPadula', 'Biba', 'Clark-Wilson', '접근통제', '최소권한', '직무분리', '참조모니터'],
    content: `

<h3>접근통제 3요소</h3>
<ul>
  <li><strong>식별(Identification)</strong>: 시스템에 자신을 알림 (사용자 ID)</li>
  <li><strong>인증(Authentication)</strong>: 신원 확인 (패스워드, 생체인식 등)</li>
  <li><strong>인가(Authorization)</strong>: 리소스 접근 권한 부여</li>
</ul>

<h3>접근통제 정책 유형</h3>
<table>
  <thead><tr><th>구분</th><th>특징</th><th>예</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>DAC</strong><br>임의적 접근통제</td>
      <td>데이터 소유자가 접근 권한 결정.<br>신분 기반.</td>
      <td>유닉스 파일 권한, ACL</td>
    </tr>
    <tr>
      <td><strong>MAC</strong><br>강제적 접근통제</td>
      <td>시스템이 보안 레이블 기반으로 결정.<br>군사·정부 환경.</td>
      <td>SELinux, 기밀·비밀·일반 등급</td>
    </tr>
    <tr>
      <td><strong>RBAC</strong><br>역할기반 접근통제</td>
      <td>역할(Role)에 권한 부여 후 사용자를 역할에 할당.</td>
      <td>직책별 권한 (관리자, 일반직원)</td>
    </tr>
    <tr>
      <td><strong>ABAC</strong><br>속성기반 접근통제</td>
      <td>사용자·자원·환경 속성 조합으로 결정.</td>
      <td>시간·위치·부서 기반 정책</td>
    </tr>
  </tbody>
</table>

<h3>보안 모델</h3>
<ul>
  <li><strong>Bell-LaPadula 모델</strong>: 기밀성 중심. MAC 기반.
    <ul>
      <li>No Read Up: 높은 등급 문서 읽기 금지 (단순 보안 속성)</li>
      <li>No Write Down: 낮은 등급으로 쓰기 금지 (*-속성)</li>
    </ul>
  </li>
  <li><strong>Biba 모델</strong>: 무결성 중심. Bell-LaPadula의 반대.
    <ul>
      <li>No Read Down: 낮은 등급 읽기 금지</li>
      <li>No Write Up: 높은 등급으로 쓰기 금지</li>
    </ul>
  </li>
  <li><strong>Clark-Wilson 모델</strong>: 상업적 환경의 무결성. CDI(통제 데이터), UDI(비통제 데이터), TP(변환 절차), IVP(무결성 검증)</li>
  <li><strong>Chinese Wall(Brewer-Nash)</strong>: 이해충돌 방지. 경쟁사 정보 접근 제한.</li>
</ul>

<h3>참조 모니터 (Reference Monitor)</h3>
<p>모든 접근 요청을 중재하는 추상적 개념. 구현체: <strong>보안 커널(Security Kernel)</strong>. 요건: 격리성·완전성·검증가능성.</p>

<h3>접근통제 원칙</h3>
<ul>
  <li><strong>최소권한(Least Privilege)</strong>: 업무 수행에 필요한 최소한의 권한만 부여</li>
  <li><strong>직무분리(Separation of Duties)</strong>: 한 사람이 전체 프로세스 통제 불가</li>
  <li><strong>알 필요성(Need-to-Know)</strong>: 업무 수행에 필요한 정보만 접근</li>
</ul>
    `,
  },

  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'cryptography',
    chapterLabel: '암호학',
    keywords: ['암호', 'DES', 'AES', 'RSA', 'ECC', '해시', 'SHA', 'MD5', '디지털 서명', '공개키', '대칭키', 'PKI', '인증서'],
    content: `

<h3>암호화 유형</h3>
<table>
  <thead><tr><th>구분</th><th>대칭키 암호화</th><th>비대칭키 암호화</th></tr></thead>
  <tbody>
    <tr><td>키</td><td>암·복호화 동일 키</td><td>공개키(암호화) / 개인키(복호화)</td></tr>
    <tr><td>속도</td><td>빠름</td><td>느림</td></tr>
    <tr><td>키 관리</td><td>n(n-1)/2개 필요</td><td>2n개 필요</td></tr>
    <tr><td>대표 알고리즘</td><td>DES, 3DES, AES, ARIA, SEED</td><td>RSA, ECC, ElGamal, Diffie-Hellman</td></tr>
  </tbody>
</table>

<h3>주요 대칭키 알고리즘</h3>
<ul>
  <li><strong>DES</strong>: 56bit 키, 64bit 블록. 현재 안전하지 않음.</li>
  <li><strong>3DES (Triple DES)</strong>: DES 3번 적용. 112bit 또는 168bit 보안.</li>
  <li><strong>AES</strong>: 128/192/256bit 키, 128bit 블록. 미국 표준.</li>
  <li><strong>ARIA</strong>: 128/192/256bit 키. 국내 표준 (국정원).</li>
  <li><strong>SEED</strong>: 128bit 키, 128bit 블록. 국내 표준 (KISA).</li>
</ul>

<h3>블록 암호 운용 모드</h3>
<ul>
  <li><strong>ECB</strong>: 블록 독립 암호화. 패턴 노출 위험.</li>
  <li><strong>CBC</strong>: 이전 블록 XOR. 오류 전파.</li>
  <li><strong>CTR</strong>: 카운터 기반. 병렬 처리 가능.</li>
  <li><strong>GCM</strong>: CTR + 인증. AEAD (인증 암호화).</li>
</ul>

<h3>해시 함수</h3>
<ul>
  <li><strong>MD5</strong>: 128bit 출력. 충돌 취약점 발견, 사용 지양.</li>
  <li><strong>SHA-1</strong>: 160bit 출력. 취약점 발견, 사용 지양.</li>
  <li><strong>SHA-256/384/512</strong>: 현재 표준. 256/384/512bit 출력.</li>
  <li><strong>HAS-160</strong>: 국내 표준 해시.</li>
</ul>
<p>해시 특성: 일방향성, 충돌 저항성, 역상 저항성, 제2역상 저항성</p>

<h3>디지털 서명</h3>
<p>서명자의 <strong>개인키로 서명</strong> → 검증자는 <strong>공개키로 검증</strong>.</p>
<p>기능: 부인 방지 + 인증 + 무결성. 기밀성은 제공하지 않음.</p>

<h3>PKI (공개키 기반 구조)</h3>
<ul>
  <li><strong>CA (인증기관)</strong>: 인증서 발급·폐기</li>
  <li><strong>RA (등록기관)</strong>: 사용자 신원 확인 후 CA에 인증서 발급 요청</li>
  <li><strong>인증서</strong>: 공개키 + 소유자 정보 + CA 서명 (X.509 형식)</li>
  <li><strong>CRL</strong>: 인증서 폐기 목록. OCSP: 실시간 폐기 확인</li>
</ul>
    `,
  },

  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'malware',
    chapterLabel: '악성코드',
    keywords: ['악성코드', '바이러스', '웜', '트로이목마', '랜섬웨어', '루트킷', '스파이웨어', '봇넷', '키로거', '백도어'],
    content: `

<h3>악성코드 유형</h3>
<table>
  <thead><tr><th>유형</th><th>특징</th><th>자기복제</th><th>숙주 필요</th></tr></thead>
  <tbody>
    <tr><td><strong>바이러스(Virus)</strong></td><td>다른 프로그램에 기생, 실행 시 감염</td><td>O</td><td>O</td></tr>
    <tr><td><strong>웜(Worm)</strong></td><td>네트워크로 자율 전파, 독립 실행</td><td>O</td><td>X</td></tr>
    <tr><td><strong>트로이목마</strong></td><td>정상 프로그램으로 위장, 악의적 기능 내포</td><td>X</td><td>X</td></tr>
    <tr><td><strong>랜섬웨어</strong></td><td>파일 암호화 후 복구 대가로 금전 요구</td><td>△</td><td>X</td></tr>
    <tr><td><strong>루트킷(Rootkit)</strong></td><td>시스템 깊숙이 숨어 관리자 권한 유지, 탐지 회피</td><td>X</td><td>X</td></tr>
    <tr><td><strong>스파이웨어</strong></td><td>사용자 정보 몰래 수집·전송</td><td>X</td><td>X</td></tr>
    <tr><td><strong>애드웨어</strong></td><td>광고 강제 표시. 스파이웨어 성격 포함</td><td>X</td><td>X</td></tr>
    <tr><td><strong>키로거</strong></td><td>키 입력 내용 가로채기 (패스워드 탈취)</td><td>X</td><td>X</td></tr>
    <tr><td><strong>봇(Bot)/봇넷</strong></td><td>공격자 명령에 따르는 감염 PC 집합. C&C 서버로 제어</td><td>O</td><td>X</td></tr>
    <tr><td><strong>백도어</strong></td><td>인증 우회 비밀 접근 경로</td><td>X</td><td>X</td></tr>
  </tbody>
</table>

<h3>악성코드 탐지 기법</h3>
<ul>
  <li><strong>시그니처 기반</strong>: 알려진 악성코드 패턴(시그니처) DB와 비교. 신종/변종에 취약.</li>
  <li><strong>행위 기반(휴리스틱)</strong>: 의심스러운 행동 패턴 탐지. 오탐 가능.</li>
  <li><strong>무결성 검사</strong>: 파일 해시값 비교로 변조 탐지.</li>
  <li><strong>샌드박스</strong>: 격리 환경에서 실행해 악의적 행위 관찰.</li>
</ul>

<h3>APT (지능형 지속 공격)</h3>
<p>특정 대상을 장기간 지속적으로 공격하는 고도화된 위협. 단계: 정찰 → 침투 → 내부 확산 → 정보 수집 → 유출.</p>

<h3>주요 공격 기법</h3>
<ul>
  <li><strong>드라이브 바이 다운로드</strong>: 악성 웹페이지 방문만으로 자동 다운로드·설치</li>
  <li><strong>워터링홀</strong>: 표적이 자주 방문하는 사이트에 악성코드 삽입</li>
  <li><strong>스피어피싱</strong>: 특정 대상 맞춤형 피싱 이메일</li>
</ul>
    `,
  },

  // ===== 네트워크보안 =====
  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'network-basics',
    chapterLabel: '네트워크 기초',
    keywords: ['OSI', 'TCP', 'UDP', 'IP', 'ARP', 'DNS', 'DHCP', '라우터', '스위치', '포트', 'ICMP', 'HTTP', 'HTTPS'],
    content: `

<h3>OSI 7계층</h3>
<table>
  <thead><tr><th>계층</th><th>이름</th><th>프로토콜/장비</th><th>데이터 단위</th></tr></thead>
  <tbody>
    <tr><td>7</td><td>응용(Application)</td><td>HTTP, FTP, SMTP, DNS</td><td>메시지</td></tr>
    <tr><td>6</td><td>표현(Presentation)</td><td>SSL/TLS, JPEG, MPEG</td><td>메시지</td></tr>
    <tr><td>5</td><td>세션(Session)</td><td>NetBIOS, RPC</td><td>메시지</td></tr>
    <tr><td>4</td><td>전송(Transport)</td><td>TCP, UDP</td><td>세그먼트</td></tr>
    <tr><td>3</td><td>네트워크(Network)</td><td>IP, ICMP, ARP, 라우터</td><td>패킷</td></tr>
    <tr><td>2</td><td>데이터링크(Data Link)</td><td>Ethernet, MAC, 스위치</td><td>프레임</td></tr>
    <tr><td>1</td><td>물리(Physical)</td><td>Hub, 케이블, 리피터</td><td>비트</td></tr>
  </tbody>
</table>

<h3>TCP vs UDP</h3>
<table>
  <thead><tr><th>구분</th><th>TCP</th><th>UDP</th></tr></thead>
  <tbody>
    <tr><td>연결</td><td>연결 지향 (3-way handshake)</td><td>비연결</td></tr>
    <tr><td>신뢰성</td><td>높음 (재전송, 순서 보장)</td><td>낮음</td></tr>
    <tr><td>속도</td><td>느림</td><td>빠름</td></tr>
    <tr><td>용도</td><td>HTTP, FTP, SMTP, SSH</td><td>DNS, DHCP, VoIP, 스트리밍</td></tr>
  </tbody>
</table>

<h3>TCP 3-way Handshake</h3>
<pre><code>클라이언트 → SYN → 서버
클라이언트 ← SYN+ACK ← 서버
클라이언트 → ACK → 서버</code></pre>

<h3>주요 프로토콜과 포트</h3>
<table>
  <thead><tr><th>프로토콜</th><th>포트</th><th>용도</th></tr></thead>
  <tbody>
    <tr><td>FTP</td><td>20(데이터), 21(제어)</td><td>파일 전송</td></tr>
    <tr><td>SSH</td><td>22</td><td>보안 원격 접속</td></tr>
    <tr><td>SMTP</td><td>25</td><td>메일 송신</td></tr>
    <tr><td>DNS</td><td>53</td><td>도메인 이름 해석</td></tr>
    <tr><td>HTTP</td><td>80</td><td>웹</td></tr>
    <tr><td>POP3</td><td>110</td><td>메일 수신</td></tr>
    <tr><td>IMAP</td><td>143</td><td>메일 수신(동기화)</td></tr>
    <tr><td>HTTPS</td><td>443</td><td>보안 웹</td></tr>
    <tr><td>SNMP</td><td>161</td><td>네트워크 관리</td></tr>
    <tr><td>LDAP</td><td>389</td><td>디렉토리 서비스</td></tr>
  </tbody>
</table>

<h3>ARP (Address Resolution Protocol)</h3>
<p>IP 주소 → MAC 주소 변환. <strong>ARP Spoofing</strong>: 위조된 ARP 응답으로 트래픽 가로채기.</p>

<h3>IP 주소 체계</h3>
<ul>
  <li><strong>사설 IP 대역</strong>: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</li>
  <li><strong>루프백</strong>: 127.0.0.1</li>
  <li><strong>IPv6</strong>: 128bit, 16진수 8그룹. IPSec 기본 내장.</li>
</ul>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'firewall-ids',
    chapterLabel: '방화벽·IDS·IPS',
    keywords: ['방화벽', 'IDS', 'IPS', '침입탐지', '패킷 필터링', '상태 검사', '애플리케이션 게이트웨이', '프록시', 'DMZ', '오탐', '미탐'],
    content: `

<h3>방화벽 (Firewall)</h3>
<p>내부 네트워크와 외부 네트워크 사이에서 <strong>트래픽을 허용/차단</strong>하는 보안 장비.</p>

<h4>방화벽 유형</h4>
<table>
  <thead><tr><th>유형</th><th>동작 계층</th><th>특징</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>패킷 필터링</strong></td>
      <td>3~4계층</td>
      <td>IP·포트·프로토콜 기반 필터링. 빠름. 상태 추적 불가.</td>
    </tr>
    <tr>
      <td><strong>상태 검사(Stateful Inspection)</strong></td>
      <td>3~4계층</td>
      <td>연결 상태 테이블 유지. 패킷 필터링 + 연결 상태 추적.</td>
    </tr>
    <tr>
      <td><strong>애플리케이션 게이트웨이(프록시)</strong></td>
      <td>7계층</td>
      <td>응용 계층 분석. 내용 기반 필터링. 속도 느림.</td>
    </tr>
    <tr>
      <td><strong>NGFW (차세대 방화벽)</strong></td>
      <td>7계층</td>
      <td>IPS·앱 인식·SSL 검사 통합.</td>
    </tr>
  </tbody>
</table>

<h3>DMZ (비무장지대)</h3>
<p>외부와 내부 사이 중간 영역. 공개 서버(웹·메일·DNS)를 배치해 내부망 직접 노출 방지.</p>

<h3>IDS (침입탐지시스템)</h3>
<p>네트워크/호스트 트래픽을 분석해 <strong>침입 탐지 후 경보</strong>. 차단은 하지 않음.</p>

<h4>탐지 방식</h4>
<ul>
  <li><strong>시그니처(오용) 탐지</strong>: 알려진 공격 패턴과 비교. 정탐 높음, 신종 공격에 취약.</li>
  <li><strong>이상(Anomaly) 탐지</strong>: 정상 행위 프로파일과 비교. 신종 탐지 가능, 오탐률 높음.</li>
</ul>

<h4>배치 방식</h4>
<ul>
  <li><strong>NIDS (네트워크 기반)</strong>: 네트워크 구간에 스니핑 방식 배치.</li>
  <li><strong>HIDS (호스트 기반)</strong>: 개별 호스트에 에이전트 설치. 암호화 트래픽도 탐지.</li>
</ul>

<h4>판정 유형</h4>
<table>
  <thead><tr><th></th><th>실제 공격</th><th>정상</th></tr></thead>
  <tbody>
    <tr><td><strong>공격으로 탐지</strong></td><td>정탐(TP)</td><td>오탐(FP) — False Positive</td></tr>
    <tr><td><strong>정상으로 탐지</strong></td><td>미탐(FN) — False Negative</td><td>정상탐지(TN)</td></tr>
  </tbody>
</table>

<h3>IPS (침입방지시스템)</h3>
<p>IDS 기능 + <strong>실시간 차단</strong>. 인라인(Inline) 방식으로 배치. 오탐 시 정상 트래픽 차단 위험.</p>

<h3>UTM (통합 위협 관리)</h3>
<p>방화벽 + IPS + 안티바이러스 + VPN + 콘텐츠 필터링을 단일 장비에 통합.</p>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'vpn',
    chapterLabel: 'VPN',
    keywords: ['VPN', 'IPSec', 'SSL VPN', 'PPTP', 'L2TP', '터널링', '암호화', 'AH', 'ESP', 'IKE'],
    content: `

<p>공중망을 통해 <strong>암호화된 가상 사설 터널</strong>을 구성하는 기술. 기밀성·무결성·인증 제공.</p>

<h3>VPN 유형</h3>
<table>
  <thead><tr><th>유형</th><th>계층</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td><strong>IPSec VPN</strong></td><td>3계층 (네트워크)</td><td>LAN-to-LAN 연결. 전송·터널 모드.</td></tr>
    <tr><td><strong>SSL VPN</strong></td><td>4~7계층 (응용)</td><td>브라우저 기반. 별도 클라이언트 불필요.</td></tr>
    <tr><td><strong>PPTP</strong></td><td>2계층</td><td>MS 개발. 취약점으로 사용 감소.</td></tr>
    <tr><td><strong>L2TP</strong></td><td>2계층</td><td>PPTP + L2F 결합. 단독으로 암호화 없음 → IPSec과 함께 사용.</td></tr>
  </tbody>
</table>

<h3>IPSec 구성 요소</h3>
<ul>
  <li><strong>AH (Authentication Header)</strong>: 인증 + 무결성. 암호화 없음. IP 헤더 포함 서명.</li>
  <li><strong>ESP (Encapsulating Security Payload)</strong>: 인증 + 무결성 + <strong>암호화</strong>. 실무에서 주로 사용.</li>
  <li><strong>IKE (Internet Key Exchange)</strong>: 키 교환 및 SA(Security Association) 협상 프로토콜.</li>
  <li><strong>SA (Security Association)</strong>: 보안 연결 파라미터 집합. 단방향이므로 양방향 통신 시 2개 필요.</li>
</ul>

<h3>IPSec 동작 모드</h3>
<table>
  <thead><tr><th>모드</th><th>특징</th><th>용도</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>전송 모드(Transport)</strong></td>
      <td>원본 IP 헤더 유지. 페이로드만 보호.</td>
      <td>종단 간 (Host-to-Host)</td>
    </tr>
    <tr>
      <td><strong>터널 모드(Tunnel)</strong></td>
      <td>원본 패킷 전체를 새 IP 헤더로 캡슐화.</td>
      <td>게이트웨이 간 (LAN-to-LAN)</td>
    </tr>
  </tbody>
</table>

<h3>SSL/TLS</h3>
<p>웹 보안의 기본. TLS 1.3이 현재 표준. Handshake → 키 교환 → 대칭키 암호화 통신 순서.</p>
<ul>
  <li>SSL 3.0, TLS 1.0/1.1 취약점(POODLE, BEAST 등)으로 사용 금지</li>
  <li>TLS 1.2: 현재도 사용. TLS 1.3: 핸드셰이크 간소화, 0-RTT 지원</li>
</ul>
    `,
  },

  // ===== 어플리케이션보안 =====
  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'web-security',
    chapterLabel: '웹 보안',
    keywords: ['SQL injection', 'XSS', 'CSRF', '세션', '쿠키', '디렉토리 트래버설', 'OWASP', '파일 업로드', 'Command injection', 'XXE'],
    content: `

<h3>OWASP Top 10 주요 취약점</h3>

<h4>SQL Injection</h4>
<p>입력값에 SQL 구문을 삽입해 DB를 비정상 조작하는 공격.</p>
<pre><code>-- 공격 예시: 로그인 우회
' OR '1'='1
' OR 1=1--</code></pre>
<ul>
  <li><strong>Blind SQL Injection</strong>: 응답 내용이 아닌 참/거짓 반응으로 정보 추출</li>
  <li><strong>Union-based</strong>: UNION SELECT로 타 테이블 데이터 추출</li>
  <li><strong>대응</strong>: 준비된 구문(Prepared Statement), 입력값 검증, 최소 권한 DB 계정</li>
</ul>

<h4>XSS (Cross-Site Scripting)</h4>
<p>악성 스크립트를 웹 페이지에 삽입해 다른 사용자의 브라우저에서 실행.</p>
<ul>
  <li><strong>Stored XSS</strong>: 악성 스크립트가 DB에 저장 → 피해자가 페이지 조회 시 실행</li>
  <li><strong>Reflected XSS</strong>: URL 파라미터에 스크립트 삽입 → 즉시 응답에 포함</li>
  <li><strong>DOM-based XSS</strong>: 서버 응답 없이 클라이언트 DOM 조작</li>
  <li><strong>대응</strong>: 출력 인코딩(HTML Entity), CSP(Content Security Policy), HttpOnly 쿠키</li>
</ul>

<h4>CSRF (Cross-Site Request Forgery)</h4>
<p>인증된 사용자를 이용해 <strong>의도하지 않은 요청</strong>을 서버에 전송.</p>
<ul>
  <li>XSS는 사용자 브라우저 공격, CSRF는 서버 공격 (사용자를 매개로)</li>
  <li><strong>대응</strong>: CSRF 토큰, SameSite 쿠키, Referer 검증, CAPTCHA</li>
</ul>

<h4>세션 하이재킹</h4>
<p>세션 ID를 탈취해 인증된 사용자로 위장.</p>
<ul>
  <li>세션 고정(Session Fixation): 공격자가 세션 ID 미리 설정</li>
  <li><strong>대응</strong>: 로그인 후 세션 ID 재생성, HTTPS 강제, HttpOnly·Secure 쿠키</li>
</ul>

<h4>파일 업로드 취약점</h4>
<p>악성 파일(웹셸 등)을 서버에 업로드해 실행.</p>
<ul>
  <li><strong>대응</strong>: 확장자·MIME 타입 검증, 실행 권한 없는 디렉토리 저장, 파일명 난수화</li>
</ul>

<h4>디렉토리 트래버설</h4>
<p><code>../</code>를 이용해 웹 루트 외부 파일 접근.</p>
<pre><code>http://example.com/download?file=../../etc/passwd</code></pre>

<h3>HTTP 보안 헤더</h3>
<ul>
  <li><strong>X-Frame-Options</strong>: Clickjacking 방지</li>
  <li><strong>Content-Security-Policy</strong>: XSS 방지</li>
  <li><strong>Strict-Transport-Security (HSTS)</strong>: HTTPS 강제</li>
  <li><strong>X-Content-Type-Options</strong>: MIME 스니핑 방지</li>
</ul>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'db-security',
    chapterLabel: 'DB 보안',
    keywords: ['데이터베이스', 'DB', '뷰', '역할', '감사', '추론', '집계', '다단계 보안', '암호화', '접근통제'],
    content: `

<h3>DB 보안 요소</h3>
<ul>
  <li><strong>기밀성</strong>: 인가된 사용자만 데이터 접근</li>
  <li><strong>무결성</strong>: 데이터의 정확성·일관성 유지</li>
  <li><strong>가용성</strong>: 인가된 사용자가 필요할 때 접근 가능</li>
</ul>

<h3>DB 접근통제</h3>
<ul>
  <li><strong>계정 관리</strong>: 최소 권한 계정 사용, 불필요 계정 비활성화</li>
  <li><strong>뷰(View)</strong>: 특정 열·행만 노출하는 가상 테이블로 접근 제한</li>
  <li><strong>역할(Role)</strong>: 권한 집합을 역할로 묶어 사용자에게 부여</li>
  <li><strong>권한 부여/회수</strong>: GRANT / REVOKE 명령</li>
</ul>

<h3>추론 공격 (Inference Attack)</h3>
<p>허가된 데이터 조합으로 비허가 정보를 유추하는 공격.</p>
<ul>
  <li><strong>집계 문제(Aggregation)</strong>: 개별적으로 무해한 데이터를 합쳐 민감 정보 유추</li>
  <li><strong>대응</strong>: 쿼리 결과 제한, 셀 억제, 노이즈 추가</li>
</ul>

<h3>DB 암호화</h3>
<ul>
  <li><strong>API 방식</strong>: 응용 프로그램에서 암·복호화 처리</li>
  <li><strong>플러그인 방식</strong>: DB 서버에 암호화 모듈 추가</li>
  <li><strong>TDE (Transparent Data Encryption)</strong>: DB 엔진 수준 투명 암호화</li>
</ul>

<h3>DB 감사(Audit)</h3>
<p>DB 접근·변경 내역 로깅. 사후 추적 및 이상 탐지 목적.</p>
<ul>
  <li>감사 대상: 로그인·로그아웃, DDL/DML 수행, 권한 변경, 대용량 조회</li>
</ul>

<h3>SQL 명령어 분류</h3>
<table>
  <thead><tr><th>분류</th><th>명령어</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>DDL</td><td>CREATE, ALTER, DROP, TRUNCATE</td><td>구조 정의</td></tr>
    <tr><td>DML</td><td>SELECT, INSERT, UPDATE, DELETE</td><td>데이터 조작</td></tr>
    <tr><td>DCL</td><td>GRANT, REVOKE</td><td>권한 제어</td></tr>
    <tr><td>TCL</td><td>COMMIT, ROLLBACK, SAVEPOINT</td><td>트랜잭션 제어</td></tr>
  </tbody>
</table>
    `,
  },

  // ===== 정보보안일반 =====
  {
    subject: 'general',
    subjectLabel: '정보보안일반',
    chapter: 'security-concepts',
    chapterLabel: '보안 일반 개념',
    keywords: ['CIA', '기밀성', '무결성', '가용성', '위험', '위협', '취약점', '위험관리', '보안정책', '업무연속성', 'BCP', 'DRP'],
    content: `

<h3>정보보안 3대 목표 (CIA Triad)</h3>
<table>
  <thead><tr><th>목표</th><th>설명</th><th>위협 예시</th></tr></thead>
  <tbody>
    <tr><td><strong>기밀성 (Confidentiality)</strong></td><td>인가된 사용자만 접근</td><td>도청, 패킷 스니핑</td></tr>
    <tr><td><strong>무결성 (Integrity)</strong></td><td>데이터 정확성·완전성 유지</td><td>데이터 변조, 중간자 공격</td></tr>
    <tr><td><strong>가용성 (Availability)</strong></td><td>인가된 사용자가 필요 시 접근</td><td>DoS/DDoS 공격</td></tr>
  </tbody>
</table>
<p>추가 요소: <strong>인증성(Authenticity)</strong>, <strong>부인방지(Non-repudiation)</strong>, <strong>책임추적성(Accountability)</strong></p>

<h3>위험 관리 핵심 개념</h3>
<ul>
  <li><strong>자산(Asset)</strong>: 보호 대상 (데이터, 시스템, 인력 등)</li>
  <li><strong>위협(Threat)</strong>: 자산에 피해를 줄 수 있는 원인 (해커, 자연재해 등)</li>
  <li><strong>취약점(Vulnerability)</strong>: 위협이 악용할 수 있는 약점 (패치 미적용 등)</li>
  <li><strong>위험(Risk)</strong>: 위협이 취약점을 이용해 자산에 피해를 줄 가능성</li>
</ul>
<p><strong>위험 = 자산 × 위협 × 취약점</strong></p>

<h3>위험 처리 방법</h3>
<ul>
  <li><strong>위험 감소(Reduction)</strong>: 통제 적용으로 위험 수준 낮춤</li>
  <li><strong>위험 수용(Acceptance)</strong>: 비용 대비 수용 가능 위험으로 판단</li>
  <li><strong>위험 전가(Transfer)</strong>: 보험, 아웃소싱</li>
  <li><strong>위험 회피(Avoidance)</strong>: 위험 원인 활동 중단</li>
</ul>

<h3>보안 통제 유형</h3>
<table>
  <thead><tr><th>목적별</th><th>예시</th></tr></thead>
  <tbody>
    <tr><td><strong>예방(Preventive)</strong></td><td>방화벽, 암호화, 접근통제</td></tr>
    <tr><td><strong>탐지(Detective)</strong></td><td>IDS, 감사 로그, CCTV</td></tr>
    <tr><td><strong>교정(Corrective)</strong></td><td>백업 복구, 패치 적용</td></tr>
    <tr><td><strong>억제(Deterrent)</strong></td><td>경고 문구, 처벌 정책</td></tr>
    <tr><td><strong>복구(Recovery)</strong></td><td>재해복구계획, BCP</td></tr>
  </tbody>
</table>

<h3>BCP / DRP</h3>
<ul>
  <li><strong>BCP (Business Continuity Plan)</strong>: 재해 발생 시 핵심 업무의 연속성 유지 계획</li>
  <li><strong>DRP (Disaster Recovery Plan)</strong>: IT 시스템 복구 계획. BCP의 일부.</li>
  <li><strong>RTO (Recovery Time Objective)</strong>: 목표 복구 시간</li>
  <li><strong>RPO (Recovery Point Objective)</strong>: 목표 복구 시점 (데이터 손실 허용 범위)</li>
</ul>

<h3>DoS / DDoS</h3>
<ul>
  <li><strong>DoS (서비스 거부)</strong>: 단일 출처에서 시스템 과부하</li>
  <li><strong>DDoS (분산 서비스 거부)</strong>: 다수의 좀비 PC(봇넷)를 이용한 대규모 공격</li>
  <li>유형: SYN Flooding, Smurf, UDP Flooding, HTTP Flooding</li>
  <li>대응: 트래픽 필터링, 블랙홀 라우팅, CDN, 스크러빙 센터</li>
</ul>
    `,
  },

  // ===== 정보보안관리및법규 =====
  {
    subject: 'law',
    subjectLabel: '정보보안관리및법규',
    chapter: 'security-law',
    chapterLabel: '정보보호 관련 법규',
    keywords: ['정보통신망법', '개인정보보호법', 'ISMS', 'ISMS-P', '전자서명법', '정보보호산업법', '개인정보', '동의', '파기', '과태료'],
    content: `

<h3>주요 법률 체계</h3>
<table>
  <thead><tr><th>법률</th><th>주요 내용</th><th>소관 기관</th></tr></thead>
  <tbody>
    <tr><td><strong>정보통신망 이용촉진 및 정보보호 등에 관한 법률</strong></td><td>정보통신서비스 제공자 의무, 개인정보 보호, 해킹·스팸 규제</td><td>과학기술정보통신부</td></tr>
    <tr><td><strong>개인정보 보호법</strong></td><td>개인정보 처리 원칙·주체 권리·안전조치 의무</td><td>개인정보보호위원회</td></tr>
    <tr><td><strong>정보보호산업의 진흥에 관한 법률</strong></td><td>ISMS 인증 법적 근거</td><td>과학기술정보통신부</td></tr>
    <tr><td><strong>전자서명법</strong></td><td>공인전자서명·인증서 제도</td><td>과학기술정보통신부</td></tr>
    <tr><td><strong>전자금융거래법</strong></td><td>금융 분야 전자거래 보안</td><td>금융위원회</td></tr>
  </tbody>
</table>

<h3>개인정보 보호법 핵심</h3>
<h4>개인정보의 정의</h4>
<p>살아 있는 개인에 관한 정보로서 성명·주민등록번호 등으로 개인을 알아볼 수 있는 정보 (다른 정보와 결합해 알아볼 수 있는 것 포함).</p>

<h4>처리 원칙</h4>
<ul>
  <li>목적 명확화 → 최소 수집 → 목적 범위 내 처리 → 안전한 관리 → 권리 보장</li>
</ul>

<h4>민감정보</h4>
<p>사상·신념, 노동조합·정당 가입·탈퇴, 정치적 견해, 건강·성생활, 유전정보, 범죄경력, 생체인식정보 등. <strong>별도 동의 필요.</strong></p>

<h4>정보주체 권리</h4>
<ul>
  <li>열람권, 정정·삭제권, 처리정지권, 동의 철회권</li>
</ul>

<h3>ISMS (정보보호 관리체계)</h3>
<p>조직의 정보보호 활동이 지속·체계적으로 이루어지도록 하는 관리체계. <strong>KISA에서 인증 운영.</strong></p>
<ul>
  <li><strong>ISMS</strong>: 정보보호 관리체계 인증</li>
  <li><strong>ISMS-P</strong>: ISMS + 개인정보보호 관리체계 통합 인증</li>
</ul>

<h4>의무 인증 대상 (ISMS)</h4>
<ul>
  <li>ISP (인터넷서비스제공자)</li>
  <li>IDC (인터넷데이터센터)</li>
  <li>매출액 또는 이용자 수 기준 이상의 정보통신서비스 제공자</li>
</ul>

<h3>개인정보 안전조치 기준</h3>
<ul>
  <li>내부 관리계획 수립·시행</li>
  <li>접근통제 및 접근권한 관리</li>
  <li>암호화 (주민등록번호 등 고유식별정보, 비밀번호, 바이오정보)</li>
  <li>접속기록 보관 및 점검 (최소 6개월 이상)</li>
  <li>보안프로그램 설치·운영</li>
  <li>물리적 안전조치</li>
</ul>

<h3>주요 처벌 기준</h3>
<ul>
  <li>개인정보 누출 등 → 5년 이하 징역 또는 5천만원 이하 벌금</li>
  <li>안전조치 의무 위반 → 과태료 3천만원 이하</li>
</ul>
    `,
  },
];
