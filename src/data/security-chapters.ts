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
    chapter: 'linux-security',
    chapterLabel: '유닉스·리눅스 보안',
    keywords: ['umask', '파일 권한', 'setuid', 'setgid', 'sticky bit', '/etc/passwd', '/etc/shadow', '계정', '패스워드', 'RUID', 'EUID', 'TCP Wrapper', 'sudoers', '로그'],
    content: `
<h3>파일 권한 (rwx)</h3>
<p>리눅스 파일 권한은 소유자(User)/그룹(Group)/기타(Other) 3계층, 각각 읽기(r=4)/쓰기(w=2)/실행(x=1) 3비트로 표현합니다.</p>
<pre><code>ls -l 출력 예시:
-rwxr-xr-- 1 alice staff 1024 May 1 12:00 script.sh
 ↑↑↑↑ ↑↑↑ ↑↑↑
 │소유자 │그룹 │기타
 rwx=7  r-x=5  r--=4  →  옥탈: 754</code></pre>

<h3>umask</h3>
<p>umask는 파일/디렉토리 생성 시 기본 권한에서 제거할 비트를 지정합니다.<br>
파일 기본권한 666, 디렉토리 기본권한 777에서 umask 값을 뺍니다.</p>
<table>
  <thead><tr><th>umask</th><th>파일 생성 권한</th><th>디렉토리 생성 권한</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>022</td><td>644 (rw-r--r--)</td><td>755 (rwxr-xr-x)</td><td>일반적 기본값</td></tr>
    <tr><td>027</td><td>640 (rw-r-----)</td><td>750 (rwxr-x---)</td><td>그룹까지만 읽기</td></tr>
    <tr><td>077</td><td>600 (rw-------)</td><td>700 (rwx------)</td><td>소유자만 접근</td></tr>
  </tbody>
</table>

<h3>특수 권한</h3>
<table>
  <thead><tr><th>이름</th><th>옥탈</th><th>파일 효과</th><th>디렉토리 효과</th><th>ls -l 표시</th></tr></thead>
  <tbody>
    <tr><td>SetUID (SUID)</td><td>4000</td><td>실행 시 파일 소유자 권한으로 실행</td><td>효과 없음</td><td>소유자 x 자리 → <code>s</code> (없으면 <code>S</code>)</td></tr>
    <tr><td>SetGID (SGID)</td><td>2000</td><td>실행 시 파일 그룹 권한으로 실행</td><td>하위 파일이 디렉토리 그룹 상속</td><td>그룹 x 자리 → <code>s</code></td></tr>
    <tr><td>Sticky Bit</td><td>1000</td><td>효과 없음(과거 메모리 고정)</td><td>자신의 파일만 삭제 가능 (예: /tmp)</td><td>기타 x 자리 → <code>t</code></td></tr>
  </tbody>
</table>
<h4>SetUID 보안 위험 및 점검</h4>
<pre><code># SetUID 파일 전체 검색
find / -perm -4000 -type f 2&gt;/dev/null

# 불필요한 SUID 제거
chmod u-s /경로/파일</code></pre>

<h3>/etc/passwd 필드 (7개)</h3>
<pre><code>root:x:0:0:root:/root:/bin/bash
 ①   ② ③ ④  ⑤   ⑥      ⑦
① 사용자명  ② 패스워드(x=shadow로 이동)  ③ UID
④ GID  ⑤ 코멘트(GECOS)  ⑥ 홈디렉토리  ⑦ 기본 셸</code></pre>

<h3>/etc/shadow 필드 및 해시 prefix</h3>
<pre><code>alice:$6$salt$hash:19000:0:99999:7:::
  ①      ②           ③   ④   ⑤  ⑥
① 사용자명  ② 해시(prefix+salt+해시값)  ③ 최근 변경일(epoch 기준 일수)
④ 최소변경기간  ⑤ 최대변경기간  ⑥ 만료 경고일수</code></pre>
<table>
  <thead><tr><th>Prefix</th><th>알고리즘</th><th>권장</th></tr></thead>
  <tbody>
    <tr><td>$1$</td><td>MD5</td><td>취약 — 사용 금지</td></tr>
    <tr><td>$5$</td><td>SHA-256</td><td>허용</td></tr>
    <tr><td>$6$</td><td>SHA-512</td><td>권장</td></tr>
    <tr><td>$2b$</td><td>bcrypt</td><td>권장</td></tr>
  </tbody>
</table>

<h3>/etc/login.defs 주요 설정</h3>
<table>
  <thead><tr><th>설정 키</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>PASS_MAX_DAYS</td><td>패스워드 최대 유효 기간 (일)</td></tr>
    <tr><td>PASS_MIN_DAYS</td><td>패스워드 최소 변경 금지 기간 (일)</td></tr>
    <tr><td>PASS_MIN_LEN</td><td>패스워드 최소 길이</td></tr>
    <tr><td>PASS_WARN_AGE</td><td>만료 전 경고 일수</td></tr>
    <tr><td>UID_MIN / UID_MAX</td><td>일반 사용자 UID 범위</td></tr>
  </tbody>
</table>

<h3>RUID / EUID / SUID 개념</h3>
<table>
  <thead><tr><th>식별자</th><th>의미</th><th>역할</th></tr></thead>
  <tbody>
    <tr><td>RUID (Real UID)</td><td>실제 사용자 ID</td><td>프로세스를 시작한 사용자</td></tr>
    <tr><td>EUID (Effective UID)</td><td>유효 사용자 ID</td><td>권한 검사에 실제 사용되는 ID (SetUID 시 소유자 UID로 전환)</td></tr>
    <tr><td>SUID (Saved UID)</td><td>저장된 사용자 ID</td><td>EUID 변경 전 값 저장 (나중에 복원 가능)</td></tr>
  </tbody>
</table>

<h3>주요 보안 파일</h3>
<table>
  <thead><tr><th>파일/디렉토리</th><th>역할</th></tr></thead>
  <tbody>
    <tr><td>/etc/passwd</td><td>사용자 계정 정보 (공개)</td></tr>
    <tr><td>/etc/shadow</td><td>패스워드 해시 (root만 접근)</td></tr>
    <tr><td>/etc/group</td><td>그룹 정보</td></tr>
    <tr><td>/etc/sudoers</td><td>sudo 권한 설정 (visudo로 편집)</td></tr>
    <tr><td>/etc/hosts.allow</td><td>TCP Wrapper 허용 규칙</td></tr>
    <tr><td>/etc/hosts.deny</td><td>TCP Wrapper 거부 규칙</td></tr>
    <tr><td>/var/log/auth.log</td><td>인증 관련 로그 (Debian계열)</td></tr>
    <tr><td>/var/log/secure</td><td>인증 관련 로그 (RedHat계열)</td></tr>
    <tr><td>/var/log/wtmp</td><td>로그인 이력 (last 명령으로 조회)</td></tr>
    <tr><td>/var/log/btmp</td><td>로그인 실패 이력 (lastb 명령)</td></tr>
  </tbody>
</table>

<h3>TCP Wrapper</h3>
<p>inetd/xinetd 기반 서비스에 대한 호스트 기반 접근통제. <strong>/etc/hosts.allow가 /etc/hosts.deny보다 먼저 확인</strong>되며, 허용 규칙이 있으면 즉시 허용합니다.</p>
<pre><code># /etc/hosts.allow (허용 우선)
sshd: 192.168.1.0/24

# /etc/hosts.deny (나머지 차단)
ALL: ALL</code></pre>
    `,
  },
  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'windows-security',
    chapterLabel: '윈도우 보안',
    keywords: ['SAM', '레지스트리', 'NTFS', 'DACL', 'SACL', '이벤트 로그', 'UAC', '계정 잠금', 'BitLocker', 'NTLM'],
    content: `
<h3>SAM 데이터베이스</h3>
<p>SAM(Security Account Manager)은 로컬 계정의 인증 정보를 저장하는 윈도우 데이터베이스입니다.</p>
<table>
  <thead><tr><th>항목</th><th>내용</th></tr></thead>
  <tbody>
    <tr><td>위치</td><td>%SystemRoot%\System32\config\SAM (레지스트리 HKLM\SAM)</td></tr>
    <tr><td>저장 형식</td><td>NTLM 해시 (MD4(패스워드))</td></tr>
    <tr><td>접근 제한</td><td>실행 중 OS는 잠금, SYSTEM 계정만 접근 가능</td></tr>
    <tr><td>공격 기법</td><td>Pass the Hash, SAM 덤프(fgdump, mimikatz)</td></tr>
  </tbody>
</table>

<h3>레지스트리 하이브</h3>
<table>
  <thead><tr><th>하이브</th><th>약어</th><th>역할</th></tr></thead>
  <tbody>
    <tr><td>HKEY_LOCAL_MACHINE</td><td>HKLM</td><td>시스템 전체 하드웨어·소프트웨어·보안 설정</td></tr>
    <tr><td>HKEY_CURRENT_USER</td><td>HKCU</td><td>현재 로그인 사용자 설정</td></tr>
    <tr><td>HKEY_USERS</td><td>HKU</td><td>모든 사용자 프로파일</td></tr>
    <tr><td>HKEY_CLASSES_ROOT</td><td>HKCR</td><td>파일 확장자 연결·COM 객체 등록</td></tr>
    <tr><td>HKEY_CURRENT_CONFIG</td><td>HKCC</td><td>현재 하드웨어 프로파일</td></tr>
  </tbody>
</table>

<h4>주요 보안 관련 레지스트리 키</h4>
<table>
  <thead><tr><th>레지스트리 키</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run</td><td>시스템 부팅 시 자동 실행 프로그램</td></tr>
    <tr><td>HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run</td><td>사용자 로그온 시 자동 실행</td></tr>
    <tr><td>HKLM\SAM\SAM</td><td>계정 해시 저장 (SYSTEM 전용)</td></tr>
    <tr><td>HKLM\SYSTEM\CurrentControlSet\Services</td><td>서비스 설정 (악성코드 지속성 확보)</td></tr>
  </tbody>
</table>

<h3>NTFS 권한 (DACL / SACL)</h3>
<table>
  <thead><tr><th>구분</th><th>DACL (Discretionary ACL)</th><th>SACL (System ACL)</th></tr></thead>
  <tbody>
    <tr><td>목적</td><td>접근 허용/거부 제어</td><td>감사(Audit) 로그 기록 제어</td></tr>
    <tr><td>설정 주체</td><td>객체 소유자</td><td>관리자(SeSecurityPrivilege 필요)</td></tr>
    <tr><td>ACE 구성</td><td>Allow ACE / Deny ACE</td><td>Audit ACE (성공/실패 기록)</td></tr>
  </tbody>
</table>
<p><strong>ACE 평가 순서:</strong> Deny ACE가 Allow ACE보다 항상 우선 적용됩니다.</p>

<h3>주요 보안 이벤트 ID</h3>
<table>
  <thead><tr><th>이벤트 ID</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>4624</td><td>로그온 성공</td></tr>
    <tr><td>4625</td><td>로그온 실패</td></tr>
    <tr><td>4648</td><td>명시적 자격 증명으로 로그온 시도 (runas 등)</td></tr>
    <tr><td>4720</td><td>사용자 계정 생성</td></tr>
    <tr><td>4722</td><td>사용자 계정 활성화</td></tr>
    <tr><td>4728</td><td>보안 그룹에 멤버 추가</td></tr>
    <tr><td>4732</td><td>로컬 보안 그룹에 멤버 추가</td></tr>
    <tr><td>4740</td><td>계정 잠금</td></tr>
    <tr><td>4776</td><td>NTLM 자격 증명 검증 시도</td></tr>
    <tr><td>7045</td><td>새 서비스 설치 (악성코드 지속성)</td></tr>
  </tbody>
</table>

<h3>계정 정책</h3>
<ul>
  <li><strong>잠금 임계값</strong>: 로그온 실패 N회 후 계정 잠금 (권장: 5회 이하)</li>
  <li><strong>잠금 기간</strong>: 자동 해제까지의 대기 시간 (권장: 30분 이상)</li>
  <li><strong>패스워드 복잡성</strong>: 대문자/소문자/숫자/특수문자 조합, 최소 8자 이상</li>
  <li><strong>패스워드 이력</strong>: 이전 N개 패스워드 재사용 금지</li>
</ul>

<h3>UAC (User Account Control)</h3>
<p>관리자 계정으로 로그인해도 일반 권한으로 작업하고, 관리자 권한이 필요한 작업 시 사용자 동의를 요청하는 기능입니다.</p>
<ul>
  <li>목적: 악성코드의 무단 권한 상승 방지</li>
  <li>동작: 관리자 권한 필요 시 동의(Consent) 또는 자격증명(Credential) 프롬프트 표시</li>
  <li>레지스트리: HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System</li>
</ul>

<h3>Windows 보안 도구</h3>
<table>
  <thead><tr><th>도구</th><th>실행 명령</th><th>역할</th></tr></thead>
  <tbody>
    <tr><td>레지스트리 편집기</td><td>regedit</td><td>레지스트리 조회·수정</td></tr>
    <tr><td>이벤트 뷰어</td><td>eventvwr.msc</td><td>보안/시스템/응용 프로그램 로그 조회</td></tr>
    <tr><td>로컬 보안 정책</td><td>secpol.msc</td><td>계정 정책, 감사 정책, 사용자 권한 설정</td></tr>
    <tr><td>BitLocker</td><td>제어판 &gt; BitLocker</td><td>드라이브 전체 암호화 (TPM 활용)</td></tr>
  </tbody>
</table>
    `,
  },
  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'access-control',
    chapterLabel: '접근통제',
    keywords: ['DAC', 'MAC', 'RBAC', 'ABAC', '식별', '인증', '인가', 'MFA', '지식기반', '소지기반', '특성기반', 'SSO', '최소권한', '직무분리'],
    content: `
<h3>접근통제 3단계</h3>
<table>
  <thead><tr><th>단계</th><th>설명</th><th>예시</th></tr></thead>
  <tbody>
    <tr><td><strong>식별(Identification)</strong></td><td>시스템에 자신을 알림</td><td>사용자명 입력</td></tr>
    <tr><td><strong>인증(Authentication)</strong></td><td>주장한 신원을 증명</td><td>패스워드, OTP, 생체인식</td></tr>
    <tr><td><strong>인가(Authorization)</strong></td><td>인증된 주체에게 자원 접근 권한 부여</td><td>ACL, 역할 기반 권한</td></tr>
  </tbody>
</table>

<h3>인증 요소 (Authentication Factor)</h3>
<table>
  <thead><tr><th>유형</th><th>설명</th><th>예시</th></tr></thead>
  <tbody>
    <tr><td>지식 기반 (Something you know)</td><td>알고 있는 것</td><td>패스워드, PIN, 보안 질문</td></tr>
    <tr><td>소지 기반 (Something you have)</td><td>가지고 있는 것</td><td>OTP 토큰, 스마트카드, 인증서</td></tr>
    <tr><td>특성 기반 (Something you are)</td><td>자신의 특성</td><td>지문, 홍채, 얼굴, 정맥</td></tr>
    <tr><td>MFA (다단계 인증)</td><td>2가지 이상 요소 조합</td><td>패스워드 + OTP</td></tr>
  </tbody>
</table>

<h3>접근통제 정책 유형 비교</h3>
<table>
  <thead><tr><th>구분</th><th>권한 결정 주체</th><th>기반</th><th>특징</th><th>예시</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>DAC</strong><br>(임의적 접근통제)</td>
      <td>데이터 소유자</td>
      <td>신분(Identity)</td>
      <td>유연하나 트로이목마 취약. 소유자가 자유롭게 권한 부여.</td>
      <td>유닉스 파일 권한, Windows NTFS</td>
    </tr>
    <tr>
      <td><strong>MAC</strong><br>(강제적 접근통제)</td>
      <td>시스템/관리자</td>
      <td>보안 레이블</td>
      <td>강력하나 유연성 낮음. 군사·정부 환경. 사용자가 권한 변경 불가.</td>
      <td>SELinux, 기밀/비밀/대외비/일반</td>
    </tr>
    <tr>
      <td><strong>RBAC</strong><br>(역할기반 접근통제)</td>
      <td>관리자</td>
      <td>역할(Role)</td>
      <td>역할에 권한 부여 후 사용자를 역할에 할당. 대규모 조직에 적합.</td>
      <td>직급별 ERP 권한</td>
    </tr>
    <tr>
      <td><strong>ABAC</strong><br>(속성기반 접근통제)</td>
      <td>정책 엔진</td>
      <td>속성 조합</td>
      <td>사용자·자원·환경 속성 조합으로 세밀한 정책. XACML 표준.</td>
      <td>근무시간+부서+보안등급 조합</td>
    </tr>
  </tbody>
</table>

<h3>접근 제어 행렬 (Access Control Matrix)</h3>
<p>주체(Subject)와 객체(Object)의 권한 관계를 행렬로 표현. 행: 주체, 열: 객체, 셀: 권한.</p>
<ul>
  <li><strong>ACL (Access Control List)</strong>: 열(객체) 기준으로 접근 가능한 주체 목록</li>
  <li><strong>Capability List</strong>: 행(주체) 기준으로 접근 가능한 객체 목록</li>
</ul>

<h3>접근통제 원칙</h3>
<ul>
  <li><strong>최소권한(Least Privilege)</strong>: 업무 수행에 필요한 최소한의 권한만 부여</li>
  <li><strong>직무분리(Separation of Duties)</strong>: 한 사람이 중요 프로세스 전체를 통제 불가. 내부 사기 방지</li>
  <li><strong>알 필요성(Need-to-Know)</strong>: 업무 수행에 반드시 필요한 정보만 접근 허용</li>
  <li><strong>기본 거부(Default Deny)</strong>: 명시적으로 허용되지 않은 것은 모두 거부</li>
</ul>

<h3>SSO 및 연동 프로토콜 비교</h3>
<table>
  <thead><tr><th>프로토콜</th><th>목적</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td>Kerberos</td><td>인증</td><td>티켓 기반. KDC(AS+TGS). 대칭키. 시간 동기화 필수(5분)</td></tr>
    <tr><td>SAML</td><td>인증+인가</td><td>XML 기반. IdP ↔ SP. 엔터프라이즈 SSO</td></tr>
    <tr><td>OAuth 2.0</td><td>인가(Authorization)</td><td>액세스 토큰 발급. API 위임 접근</td></tr>
    <tr><td>OpenID Connect</td><td>인증</td><td>OAuth 2.0 기반 + ID 토큰(JWT)</td></tr>
  </tbody>
</table>
    `,
  },
  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'security-model',
    chapterLabel: '보안 모델',
    keywords: ['Bell-LaPadula', 'Biba', 'Clark-Wilson', 'Chinese Wall', 'Brewer-Nash', '참조모니터', 'TCB', '보안커널', '격자모델', 'ss속성', '스타속성'],
    content: `
<h3>Bell-LaPadula 모델 (기밀성)</h3>
<p>군사 기밀 보호 목적. MAC 기반. <strong>"Read Down, Write Up"만 허용.</strong></p>
<table>
  <thead><tr><th>속성</th><th>규칙</th><th>의미</th></tr></thead>
  <tbody>
    <tr><td>ss-속성 (단순 보안 속성)</td><td>No Read Up</td><td>자신보다 높은 등급 객체 읽기 금지</td></tr>
    <tr><td>*-속성 (스타 속성)</td><td>No Write Down</td><td>자신보다 낮은 등급 객체 쓰기 금지 (정보 유출 방지)</td></tr>
    <tr><td>ds-속성 (임의 보안 속성)</td><td>DAC 규칙 적용</td><td>접근통제 행렬로 추가 제한</td></tr>
  </tbody>
</table>
<p>단점: 무결성 보장 안 됨 (낮은 등급 사용자가 높은 등급에 쓸 수 있음)</p>

<h3>Biba 모델 (무결성)</h3>
<p>Bell-LaPadula와 반대 방향. <strong>"Read Up, Write Down"만 허용.</strong></p>
<table>
  <thead><tr><th>속성</th><th>규칙</th><th>의미</th></tr></thead>
  <tbody>
    <tr><td>단순 무결성 속성</td><td>No Read Down</td><td>낮은 등급 객체 읽기 금지 (오염 방지)</td></tr>
    <tr><td>*-무결성 속성</td><td>No Write Up</td><td>높은 등급 객체 쓰기 금지</td></tr>
  </tbody>
</table>
<p>단점: 기밀성 보장 안 됨</p>

<h3>Bell-LaPadula vs Biba 비교</h3>
<table>
  <thead><tr><th>구분</th><th>Bell-LaPadula</th><th>Biba</th></tr></thead>
  <tbody>
    <tr><td>보호 목표</td><td>기밀성(Confidentiality)</td><td>무결성(Integrity)</td></tr>
    <tr><td>읽기 규칙</td><td>No Read Up (상위 읽기 금지)</td><td>No Read Down (하위 읽기 금지)</td></tr>
    <tr><td>쓰기 규칙</td><td>No Write Down (하위 쓰기 금지)</td><td>No Write Up (상위 쓰기 금지)</td></tr>
    <tr><td>허용 방향</td><td>Read Down, Write Up</td><td>Read Up, Write Down</td></tr>
    <tr><td>적용 환경</td><td>군사·정부</td><td>상업적 무결성</td></tr>
  </tbody>
</table>

<h3>Clark-Wilson 모델 (상업적 무결성)</h3>
<p>상업 환경 무결성 보장. 3가지 목표: 인가된 사용자의 부정 조작 방지 / 직무 분리 / 트랜잭션 로깅.</p>
<table>
  <thead><tr><th>구성 요소</th><th>의미</th></tr></thead>
  <tbody>
    <tr><td>CDI (Constrained Data Item)</td><td>무결성 통제가 적용되는 데이터</td></tr>
    <tr><td>UDI (Unconstrained Data Item)</td><td>통제 없는 입력 데이터 (외부 입력)</td></tr>
    <tr><td>TP (Transformation Procedure)</td><td>CDI를 변환하는 유일한 프로그램</td></tr>
    <tr><td>IVP (Integrity Verification Procedure)</td><td>CDI 무결성 검증 절차</td></tr>
  </tbody>
</table>

<h3>Chinese Wall 모델 (Brewer-Nash)</h3>
<p>이해충돌(Conflict of Interest) 방지. 컨설팅·금융 환경.</p>
<ul>
  <li>한 번 A사 정보 접근 시 경쟁사 B사 정보 접근 자동 차단</li>
  <li>시간이 지남에 따라 접근 가능 객체가 동적으로 변함 (DAC+MAC 혼합 특성)</li>
</ul>

<h3>기타 보안 모델</h3>
<table>
  <thead><tr><th>모델</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td>HRU (Harrison-Ruzzo-Ullman)</td><td>접근 행렬 기반. 권한 변경 연산 정의. 안전성 결정 불가(비결정적)</td></tr>
    <tr><td>Take-Grant</td><td>권한 전달(Grant)·가져오기(Take) 연산으로 권한 흐름 분석</td></tr>
    <tr><td>격자 모델(Lattice)</td><td>보안 레벨 간 편순서 관계. Bell-LaPadula의 수학적 기반</td></tr>
  </tbody>
</table>

<h3>참조 모니터 (Reference Monitor)</h3>
<p>모든 접근 요청을 중재하는 추상적 개념. 3가지 필수 요건:</p>
<ul>
  <li><strong>격리성(Isolation)</strong>: 변조·우회 불가하게 격리</li>
  <li><strong>완전성(Completeness)</strong>: 모든 접근 요청 반드시 통과</li>
  <li><strong>검증가능성(Verifiability)</strong>: 정확성 검증·테스트 가능</li>
</ul>
<p>구현체: <strong>보안 커널(Security Kernel)</strong>. TCB(Trusted Computing Base)의 핵심 구성 요소.</p>
<p><strong>TCB</strong>: 시스템 보안 정책을 강제하는 하드웨어·소프트웨어·펌웨어의 집합. 보안 커널 + 보안 관련 프로세스.</p>
    `,
  },

  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'symmetric-crypto',
    chapterLabel: '대칭키 암호화',
    keywords: ['DES', 'AES', 'ARIA', 'SEED', 'LEA', '3DES', 'ECB', 'CBC', 'CTR', 'GCM', 'RC4', 'AEAD', '블록암호', '스트림암호'],
    content: `
<h3>암호화 유형 간단 비교</h3>
<table>
  <thead><tr><th>구분</th><th>대칭키</th><th>비대칭키</th><th>해시</th></tr></thead>
  <tbody>
    <tr><td>키</td><td>암·복호화 동일 키</td><td>공개키/개인키 쌍</td><td>키 없음 (단방향)</td></tr>
    <tr><td>속도</td><td>빠름</td><td>매우 느림</td><td>매우 빠름</td></tr>
    <tr><td>키 수(n명)</td><td>n(n-1)/2</td><td>2n</td><td>해당 없음</td></tr>
    <tr><td>주요 용도</td><td>대용량 데이터 암호화</td><td>키 교환, 디지털 서명</td><td>무결성 검증, 패스워드</td></tr>
  </tbody>
</table>

<h3>블록 암호 vs 스트림 암호</h3>
<table>
  <thead><tr><th>구분</th><th>블록 암호</th><th>스트림 암호</th></tr></thead>
  <tbody>
    <tr><td>처리 단위</td><td>고정 크기 블록 (64/128bit)</td><td>1비트 또는 1바이트씩</td></tr>
    <tr><td>패딩</td><td>필요 (블록 크기 맞춤)</td><td>불필요</td></tr>
    <tr><td>속도</td><td>상대적으로 느림</td><td>빠름</td></tr>
    <tr><td>대표</td><td>DES, AES, ARIA, SEED</td><td>RC4, A5/1, ChaCha20</td></tr>
  </tbody>
</table>

<h3>주요 블록 암호 알고리즘</h3>
<table>
  <thead><tr><th>알고리즘</th><th>키 길이</th><th>블록 크기</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td><strong>DES</strong></td><td>56bit</td><td>64bit</td><td>1977년 미국 표준. 현재 안전하지 않음. 전사적 공격 가능.</td></tr>
    <tr><td><strong>3DES</strong></td><td>168bit (실효 112bit)</td><td>64bit</td><td>EDE 방식. 느림. 레거시 호환.</td></tr>
    <tr><td><strong>AES</strong></td><td>128/192/256bit</td><td>128bit</td><td>2001년 미국 표준(FIPS 197). Rijndael. 현재 가장 널리 사용.</td></tr>
    <tr><td><strong>ARIA</strong></td><td>128/192/256bit</td><td>128bit</td><td>국내 표준(KS X 1213). 국정원 개발.</td></tr>
    <tr><td><strong>SEED</strong></td><td>128/256bit</td><td>128bit</td><td>국내 표준(KS X 1005). KISA 개발. 전자금융.</td></tr>
    <tr><td><strong>LEA</strong></td><td>128/192/256bit</td><td>128bit</td><td>경량 암호화. IoT 환경. 국내 표준.</td></tr>
  </tbody>
</table>

<h3>블록 암호 운용 모드</h3>
<table>
  <thead><tr><th>모드</th><th>패딩</th><th>병렬처리</th><th>특징</th><th>용도</th></tr></thead>
  <tbody>
    <tr><td><strong>ECB</strong></td><td>필요</td><td>가능</td><td>블록 독립 암호화. 같은 평문→같은 암호문. 패턴 노출. 사용 금지.</td><td>사용 금지</td></tr>
    <tr><td><strong>CBC</strong></td><td>필요</td><td>복호화만</td><td>이전 암호문 블록과 XOR. IV 필요. 오류 전파.</td><td>파일 암호화</td></tr>
    <tr><td><strong>CFB</strong></td><td>불필요</td><td>복호화만</td><td>스트림 암호처럼 동작. IV 필요.</td><td>스트림 데이터</td></tr>
    <tr><td><strong>OFB</strong></td><td>불필요</td><td>불가</td><td>키 스트림 사전 생성. 오류 비전파.</td><td>위성통신</td></tr>
    <tr><td><strong>CTR</strong></td><td>불필요</td><td>가능</td><td>카운터 값 암호화 후 XOR. 완전 병렬.</td><td>고성능</td></tr>
    <tr><td><strong>GCM</strong></td><td>불필요</td><td>가능</td><td>CTR + GHASH 인증. AEAD. 인증 태그 생성.</td><td>TLS 1.3</td></tr>
  </tbody>
</table>

<h3>AEAD 및 스트림 암호</h3>
<p><strong>AEAD (Authenticated Encryption with Associated Data)</strong>: 암호화 + 인증을 동시 제공. GCM, CCM, ChaCha20-Poly1305.</p>
<p><strong>RC4</strong>: SSL/WEP에 사용됐으나 편향성 취약점 발견. 현재 사용 금지.</p>
    `,
  },
  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'asymmetric-crypto',
    chapterLabel: '비대칭키 암호화',
    keywords: ['RSA', 'ECC', 'Diffie-Hellman', 'ElGamal', 'DSA', '소인수분해', '이산로그', '타원곡선', '하이브리드', '공개키', '개인키'],
    content: `
<h3>비대칭키 기본 원리</h3>
<ul>
  <li><strong>암호화</strong>: 수신자의 공개키로 암호화 → 수신자의 개인키로 복호화</li>
  <li><strong>디지털 서명</strong>: 송신자의 개인키로 서명 → 수신자가 공개키로 검증</li>
</ul>

<h3>주요 비대칭키 알고리즘</h3>
<table>
  <thead><tr><th>알고리즘</th><th>수학적 기반</th><th>권장 키 길이</th><th>용도</th></tr></thead>
  <tbody>
    <tr><td><strong>RSA</strong></td><td>소인수분해의 어려움</td><td>2048bit 이상</td><td>암호화, 디지털 서명</td></tr>
    <tr><td><strong>ECC</strong></td><td>타원곡선 이산로그 문제</td><td>256bit</td><td>모바일/IoT (짧은 키로 동등 보안)</td></tr>
    <tr><td><strong>Diffie-Hellman (DH)</strong></td><td>이산로그 문제</td><td>2048bit 이상</td><td>키 교환 전용 (암호화·서명 불가)</td></tr>
    <tr><td><strong>ElGamal</strong></td><td>이산로그 문제</td><td>1024bit 이상</td><td>암호화, 서명</td></tr>
    <tr><td><strong>DSA</strong></td><td>이산로그 문제</td><td>1024~3072bit</td><td>디지털 서명 전용</td></tr>
  </tbody>
</table>

<h3>RSA 원리</h3>
<p>두 큰 소수 p, q의 곱 n=p×q에서, n만 알고서 p, q를 소인수분해하기 어렵다는 수학적 난제를 기반으로 합니다.</p>
<ul>
  <li>키 길이: 현재 2048bit 이상 권장 (1024bit 이하 취약)</li>
  <li>RSA 2048bit ≈ ECC 224bit ≈ AES 112bit (동등 보안강도)</li>
</ul>

<h3>ECC 특징</h3>
<p>타원곡선 위의 점 덧셈 연산을 기반으로 하는 암호화. RSA보다 짧은 키로 동등한 보안강도를 제공합니다.</p>
<table>
  <thead><tr><th>ECC 키 길이</th><th>동등 RSA 키 길이</th></tr></thead>
  <tbody>
    <tr><td>256bit</td><td>3072bit</td></tr>
    <tr><td>384bit</td><td>7680bit</td></tr>
    <tr><td>521bit</td><td>15360bit</td></tr>
  </tbody>
</table>

<h3>Diffie-Hellman 키 교환</h3>
<p>공개 채널에서 안전하게 공유 비밀키 생성. <strong>인증 기능 없음</strong> → 중간자 공격(MITM) 취약.</p>
<ul>
  <li><strong>DHE (임시 DH)</strong>: 매 세션마다 임시 키 생성 → PFS(Perfect Forward Secrecy) 제공</li>
  <li><strong>ECDHE</strong>: ECC 기반 DHE. TLS 1.3의 기본 키 교환 방식</li>
</ul>

<h3>하이브리드 암호화</h3>
<p>대칭키(빠른 속도)와 비대칭키(안전한 키 교환)를 결합하는 방식. HTTPS/TLS에서 사용.</p>
<pre><code>1. 세션 키(대칭키) 생성
2. 세션 키를 수신자의 공개키로 암호화 → 전송
3. 실제 데이터는 세션 키(대칭키)로 암호화 → 전송
4. 수신자: 개인키로 세션 키 복호화 → 세션 키로 데이터 복호화</code></pre>

<h3>키 관리 비교</h3>
<table>
  <thead><tr><th>구분</th><th>n명 간 필요 키 수</th></tr></thead>
  <tbody>
    <tr><td>대칭키 (1:1 비밀키)</td><td>n(n-1)/2</td></tr>
    <tr><td>비대칭키 (공개키+개인키 쌍)</td><td>2n</td></tr>
  </tbody>
</table>
    `,
  },
  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'hash-mac',
    chapterLabel: '해시·메시지 인증',
    keywords: ['MD5', 'SHA-1', 'SHA-256', 'SHA-3', 'HMAC', 'HAS-160', '충돌', '역상', '솔트', '레인보우테이블', 'bcrypt', 'PBKDF2'],
    content: `
<h3>해시 함수 4가지 특성</h3>
<table>
  <thead><tr><th>특성</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td><strong>일방향성(One-way)</strong></td><td>해시값으로 원문 복원 불가 (역산 불가)</td></tr>
    <tr><td><strong>역상 저항성(Preimage resistance)</strong></td><td>주어진 해시값 h에 대해 H(m)=h인 m 찾기 어려움</td></tr>
    <tr><td><strong>제2역상 저항성(Second preimage resistance)</strong></td><td>주어진 m1에 대해 H(m1)=H(m2)인 m2 찾기 어려움</td></tr>
    <tr><td><strong>충돌 저항성(Collision resistance)</strong></td><td>H(m1)=H(m2)인 임의의 m1≠m2 쌍 찾기 어려움</td></tr>
  </tbody>
</table>

<h3>주요 해시 알고리즘</h3>
<table>
  <thead><tr><th>알고리즘</th><th>출력 길이</th><th>상태</th></tr></thead>
  <tbody>
    <tr><td><strong>MD5</strong></td><td>128bit</td><td>충돌 공격 가능. 무결성 검증 부적합. 사용 지양.</td></tr>
    <tr><td><strong>SHA-1</strong></td><td>160bit</td><td>2017년 충돌 공격 성공(SHAttered). 사용 금지 권고.</td></tr>
    <tr><td><strong>SHA-224/256</strong></td><td>224/256bit</td><td>SHA-2 계열. 현재 표준. 가장 널리 사용.</td></tr>
    <tr><td><strong>SHA-384/512</strong></td><td>384/512bit</td><td>SHA-2 계열. 고보안 환경.</td></tr>
    <tr><td><strong>SHA-3</strong></td><td>224~512bit</td><td>Keccak 알고리즘. SHA-2와 완전히 다른 구조.</td></tr>
    <tr><td><strong>HAS-160</strong></td><td>160bit</td><td>국내 표준 해시 (KCDSA 서명에 사용).</td></tr>
  </tbody>
</table>

<h3>충돌 공격</h3>
<ul>
  <li><strong>MD5 충돌</strong>: 2004년 Wang 등이 이론 증명. 실용적 충돌 생성 가능.</li>
  <li><strong>SHA-1 충돌(SHAttered)</strong>: 2017년 Google 연구팀. 같은 SHA-1 해시값을 가진 두 PDF 파일 생성.</li>
  <li>충돌 저항성이 깨지면 디지털 서명 위조 가능 → 폐기</li>
</ul>

<h3>HMAC (Hash-based Message Authentication Code)</h3>
<p>비밀키 + 해시 함수 조합. <strong>무결성 + 인증</strong> 동시 제공. 기밀성은 제공하지 않음.</p>
<pre><code>HMAC(K, m) = H((K⊕opad) || H((K⊕ipad) || m))</code></pre>
<ul>
  <li>용도: API 요청 인증, TLS MAC, JWT HS256</li>
  <li>MAC만으로는 부인방지 불가 (키 공유 때문)</li>
</ul>

<h3>해시 공격 기법</h3>
<table>
  <thead><tr><th>공격</th><th>방법</th><th>대응</th></tr></thead>
  <tbody>
    <tr><td>무차별 대입(Brute-force)</td><td>모든 가능한 입력 시도</td><td>긴 패스워드, 느린 해시 함수</td></tr>
    <tr><td>사전 공격(Dictionary)</td><td>자주 쓰이는 단어 목록 사용</td><td>복잡한 패스워드 정책</td></tr>
    <tr><td>Rainbow Table</td><td>사전계산된 해시 역조회 테이블</td><td>솔트(Salt) 사용</td></tr>
  </tbody>
</table>

<h3>솔트(Salt)와 패스워드 저장</h3>
<p><strong>솔트</strong>: 패스워드에 랜덤 값을 추가해 해시. 같은 패스워드도 다른 해시값 → Rainbow Table 무력화.</p>
<table>
  <thead><tr><th>방식</th><th>특징</th><th>권장 여부</th></tr></thead>
  <tbody>
    <tr><td>MD5(password)</td><td>빠름, Rainbow Table 취약</td><td>금지</td></tr>
    <tr><td>SHA-256(salt+password)</td><td>빠름 — 무차별 대입 취약</td><td>비권장</td></tr>
    <tr><td><strong>bcrypt</strong></td><td>작업 계수(cost factor)로 속도 조절</td><td>권장</td></tr>
    <tr><td><strong>PBKDF2</strong></td><td>반복 해시 + 솔트. NIST 권장.</td><td>권장</td></tr>
    <tr><td><strong>Argon2</strong></td><td>메모리 집약적. 2015년 Password Hashing Competition 우승.</td><td>권장</td></tr>
  </tbody>
</table>
    `,
  },
  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'pki-signature',
    chapterLabel: 'PKI·디지털 서명',
    keywords: ['CA', 'RA', 'VA', 'PKI', 'X.509', 'CRL', 'OCSP', '디지털서명', '인증서', '공인인증서', '전자서명법', 'KISA'],
    content: `
<h3>디지털 서명 과정</h3>
<pre><code>서명(송신자):
  1. 메시지를 해시 함수로 요약 → 메시지 다이제스트(MD)
  2. MD를 송신자의 개인키로 암호화 → 디지털 서명

검증(수신자):
  1. 수신된 서명을 송신자의 공개키로 복호화 → MD'
  2. 수신된 메시지를 동일 해시 함수로 요약 → MD
  3. MD == MD' 이면 서명 유효</code></pre>

<h3>디지털 서명 제공 기능</h3>
<table>
  <thead><tr><th>제공하는 보안 기능</th><th>제공하지 않는 기능</th></tr></thead>
  <tbody>
    <tr>
      <td>무결성(Integrity), 인증(Authentication), 부인방지(Non-repudiation)</td>
      <td>기밀성(Confidentiality) — 별도 암호화 필요</td>
    </tr>
  </tbody>
</table>

<h3>PKI 구성요소</h3>
<table>
  <thead><tr><th>구성 요소</th><th>역할</th></tr></thead>
  <tbody>
    <tr><td><strong>CA (인증기관)</strong></td><td>인증서 발급·갱신·폐기. 신뢰의 근원.</td></tr>
    <tr><td><strong>RA (등록기관)</strong></td><td>사용자 신원 확인 후 CA에 인증서 발급 요청. CA와 사용자 사이 중개.</td></tr>
    <tr><td><strong>VA (검증기관)</strong></td><td>인증서 유효성 실시간 검증 (OCSP 응답 제공).</td></tr>
    <tr><td><strong>저장소(Repository)</strong></td><td>인증서·CRL 공개 저장. LDAP 디렉토리 방식.</td></tr>
  </tbody>
</table>

<h3>X.509 인증서 주요 필드</h3>
<table>
  <thead><tr><th>필드</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>버전(Version)</td><td>인증서 형식 버전 (v3 사용)</td></tr>
    <tr><td>일련번호(Serial Number)</td><td>CA 내 고유 번호</td></tr>
    <tr><td>서명 알고리즘</td><td>CA가 서명에 사용한 알고리즘</td></tr>
    <tr><td>발급자(Issuer)</td><td>인증서를 발급한 CA 정보</td></tr>
    <tr><td>유효기간(Validity)</td><td>NotBefore ~ NotAfter</td></tr>
    <tr><td>주체(Subject)</td><td>인증서 소유자 정보</td></tr>
    <tr><td>공개키 정보</td><td>소유자의 공개키 + 알고리즘</td></tr>
    <tr><td>확장(Extensions)</td><td>SAN, Key Usage, CRL 배포점 등</td></tr>
    <tr><td>CA 서명</td><td>CA 개인키로 서명한 값</td></tr>
  </tbody>
</table>

<h3>CRL vs OCSP 비교</h3>
<table>
  <thead><tr><th>구분</th><th>CRL</th><th>OCSP</th></tr></thead>
  <tbody>
    <tr><td>방식</td><td>폐기 인증서 목록 다운로드</td><td>실시간 상태 조회</td></tr>
    <tr><td>최신성</td><td>주기적 갱신 (다소 지연)</td><td>실시간</td></tr>
    <tr><td>크기</td><td>목록이 커질 수 있음</td><td>단건 응답</td></tr>
    <tr><td>프라이버시</td><td>CA에 조회 안함</td><td>CA가 조회 내역 파악 가능</td></tr>
    <tr><td>포트</td><td>HTTP 80</td><td>HTTP 80/443</td></tr>
  </tbody>
</table>
<p><strong>OCSP Stapling</strong>: 서버가 OCSP 응답을 미리 캐시해 TLS 핸드셰이크 시 클라이언트에 제공 → 성능 향상, 프라이버시 보호.</p>

<h3>인증서 검증 체인</h3>
<pre><code>Root CA (자체 서명, 브라우저/OS 내장)
  ↓ 서명
중간 CA (Intermediate CA)
  ↓ 서명
사용자(서버) 인증서</code></pre>
<p>신뢰 체인(Chain of Trust): Root CA를 신뢰하면 중간 CA와 최종 인증서도 신뢰.</p>

<h3>국내 PKI 체계</h3>
<ul>
  <li>최상위 인증기관: <strong>KISA (한국인터넷진흥원)</strong></li>
  <li>공인인증기관 5개: 금융결제원, KOSCOM, 한국정보인증, 이니텍, 한국전자인증</li>
  <li><strong>2020년 전자서명법 개정</strong>: 공인인증서(구 공인인증기관) 독점 지위 폐지. 사설 인증서와 동등 지위.</li>
</ul>
    `,
  },

  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'malware',
    chapterLabel: '악성코드·APT',
    keywords: ['바이러스', '웜', '트로이목마', '랜섬웨어', '루트킷', '스파이웨어', '봇넷', '키로거', '백도어', 'APT', '드라이브바이다운로드', '워터링홀', '스피어피싱', '공급망'],
    content: `

<h3>악성코드 유형 분류</h3>
<table>
  <thead><tr><th>유형</th><th>자기복제</th><th>숙주 필요</th><th>주요 특징</th></tr></thead>
  <tbody>
    <tr><td><strong>바이러스(Virus)</strong></td><td>O</td><td>O</td><td>다른 프로그램·파일에 기생. 실행 시 활성화. 부팅 바이러스(MBR 감염), 파일 바이러스(실행파일 감염), 매크로 바이러스.</td></tr>
    <tr><td><strong>웜(Worm)</strong></td><td>O</td><td>X</td><td>네트워크로 자율 전파. 독립 프로세스. 대역폭 소모. Morris Worm(1988), Code Red, Slammer.</td></tr>
    <tr><td><strong>트로이목마(Trojan)</strong></td><td>X</td><td>X</td><td>유용한 프로그램으로 위장. 실행 시 악성 기능 수행. RAT(원격 접근 도구) 포함.</td></tr>
    <tr><td><strong>랜섬웨어</strong></td><td>△</td><td>X</td><td>파일 암호화 후 복구 대가로 암호화폐 요구. WannaCry(2017), NotPetya, LockBit.</td></tr>
    <tr><td><strong>루트킷(Rootkit)</strong></td><td>X</td><td>X</td><td>OS 커널 수준 은폐. 탐지 극히 어려움. 프로세스·파일·네트워크 연결 숨김.</td></tr>
    <tr><td><strong>스파이웨어</strong></td><td>X</td><td>X</td><td>사용자 활동·정보 몰래 수집·전송. 키로거 포함.</td></tr>
    <tr><td><strong>애드웨어</strong></td><td>X</td><td>X</td><td>광고 강제 표시. 사용자 동의 없는 설치. 스파이웨어 성격 혼재.</td></tr>
    <tr><td><strong>키로거(Keylogger)</strong></td><td>X</td><td>X</td><td>키보드 입력 가로채기. 하드웨어형(USB)·소프트웨어형.</td></tr>
    <tr><td><strong>봇(Bot)/봇넷</strong></td><td>O</td><td>X</td><td>C&C(Command & Control) 서버의 명령으로 동작. DDoS, 스팸 발송, 정보 탈취.</td></tr>
    <tr><td><strong>백도어(Backdoor)</strong></td><td>X</td><td>X</td><td>인증 우회 비밀 접근 경로. 공격자가 재접근용으로 설치.</td></tr>
    <tr><td><strong>다운로더</strong></td><td>X</td><td>X</td><td>다른 악성코드를 다운로드·실행. 드로퍼(Dropper)와 유사.</td></tr>
    <tr><td><strong>익스플로잇(Exploit)</strong></td><td>X</td><td>X</td><td>취약점을 악용해 권한 획득. 제로데이 익스플로잇: 패치 전 취약점.</td></tr>
  </tbody>
</table>

<h3>바이러스 감염 방식</h3>
<ul>
  <li><strong>부트 바이러스</strong>: MBR(마스터 부트 레코드) 감염. 부팅 시 실행.</li>
  <li><strong>파일 바이러스</strong>: .exe, .com 등 실행파일에 코드 삽입.</li>
  <li><strong>매크로 바이러스</strong>: Office 문서 매크로 기능 악용. Melissa, Concept.</li>
  <li><strong>스크립트 바이러스</strong>: JavaScript, VBScript 활용.</li>
  <li><strong>다형성(Polymorphic) 바이러스</strong>: 복제 시마다 코드 변형 → 시그니처 탐지 회피.</li>
  <li><strong>은폐형(Stealth) 바이러스</strong>: 감염 사실 숨김. OS 인터럽트 후킹.</li>
</ul>

<h3>악성코드 탐지 기법</h3>
<table>
  <thead><tr><th>기법</th><th>원리</th><th>장점</th><th>단점</th></tr></thead>
  <tbody>
    <tr><td><strong>시그니처 기반</strong></td><td>알려진 패턴 DB와 비교</td><td>정확도 높음, 속도 빠름</td><td>신종·변종 탐지 불가</td></tr>
    <tr><td><strong>행위 기반(휴리스틱)</strong></td><td>의심 행동 패턴 탐지</td><td>신종 탐지 가능</td><td>오탐률 높음</td></tr>
    <tr><td><strong>무결성 검사</strong></td><td>파일 해시값 비교</td><td>변조 정확히 탐지</td><td>초기 해시 DB 필요</td></tr>
    <tr><td><strong>샌드박스</strong></td><td>격리 환경 실행 관찰</td><td>행위 직접 확인</td><td>느림, 샌드박스 탐지 우회 가능</td></tr>
    <tr><td><strong>평판 기반</strong></td><td>클라우드 집단 지성</td><td>빠른 신종 대응</td><td>인터넷 연결 필요</td></tr>
  </tbody>
</table>

<h3>APT (지능형 지속 위협, Advanced Persistent Threat)</h3>
<p>특정 목표를 대상으로 <strong>장기간(수개월~수년)</strong>에 걸쳐 은밀하게 진행하는 고도화된 사이버 공격.</p>

<h4>APT 공격 단계</h4>
<ol>
  <li><strong>정찰(Reconnaissance)</strong>: 목표 정보 수집 (OSINT, 소셜미디어, 공개 정보)</li>
  <li><strong>무기화(Weaponization)</strong>: 익스플로잇 + 악성코드 결합 (예: 악성 문서 파일)</li>
  <li><strong>전달(Delivery)</strong>: 스피어피싱 이메일, 드라이브바이다운로드, USB</li>
  <li><strong>취약점 실행(Exploitation)</strong>: 제로데이 또는 알려진 취약점 실행</li>
  <li><strong>설치(Installation)</strong>: 백도어·RAT 설치. 지속성 확보.</li>
  <li><strong>명령 및 제어(C2, C&C)</strong>: 공격자 서버와 통신. 명령 수신.</li>
  <li><strong>목적 달성(Actions on Objectives)</strong>: 데이터 탈취, 파괴, 랜섬웨어 배포</li>
</ol>

<h3>주요 공격 기법</h3>
<ul>
  <li><strong>드라이브 바이 다운로드(Drive-by Download)</strong>: 악성 웹페이지 방문만으로 자동 다운로드·설치. 브라우저/플러그인 취약점 악용.</li>
  <li><strong>워터링홀(Watering Hole)</strong>: 표적이 자주 방문하는 정상 사이트 해킹 → 악성코드 삽입. 방문자 자동 감염.</li>
  <li><strong>스피어피싱(Spear Phishing)</strong>: 특정 대상 맞춤형 피싱 이메일. 실제 관련자 사칭. 일반 피싱보다 성공률 높음.</li>
  <li><strong>공급망 공격(Supply Chain Attack)</strong>: 소프트웨어 공급망을 통해 신뢰된 업데이트에 악성코드 삽입. SolarWinds 사례.</li>
  <li><strong>Living off the Land(LotL)</strong>: 시스템 정상 도구(PowerShell, WMI) 악용 → 탐지 회피.</li>
  <li><strong>필리싱(Vishing/Smishing)</strong>: 전화/SMS를 이용한 피싱.</li>
</ul>

<h3>랜섬웨어 특징 및 대응</h3>
<ul>
  <li>파일 암호화 후 복구 대가로 암호화폐 요구. WannaCry(2017, EternalBlue 취약점 악용), NotPetya, LockBit.</li>
  <li><strong>3-2-1 백업 규칙</strong>: 3개 복사본 / 2개 다른 미디어 / 1개 오프사이트</li>
  <li>OS·소프트웨어 최신 패치 유지</li>
  <li>네트워크 분리(Segmentation): 감염 확산 방지</li>
  <li>EDR(Endpoint Detection and Response) 도입</li>
</ul>

<h3>악성코드 탐지 기법</h3>
<table>
  <thead><tr><th>기법</th><th>원리</th><th>장점</th><th>단점</th></tr></thead>
  <tbody>
    <tr><td><strong>시그니처 기반</strong></td><td>알려진 패턴 DB와 비교</td><td>정확도 높음, 빠름</td><td>신종·변종 탐지 불가</td></tr>
    <tr><td><strong>행위 기반(휴리스틱)</strong></td><td>의심 행동 패턴 탐지</td><td>신종 탐지 가능</td><td>오탐률 높음</td></tr>
    <tr><td><strong>무결성 검사</strong></td><td>파일 해시값 비교</td><td>변조 정확히 탐지</td><td>초기 해시 DB 필요</td></tr>
    <tr><td><strong>샌드박스</strong></td><td>격리 환경 실행 관찰</td><td>행위 직접 확인</td><td>느림, 우회 가능</td></tr>
    <tr><td><strong>평판 기반</strong></td><td>클라우드 집단 지성</td><td>빠른 신종 대응</td><td>인터넷 연결 필요</td></tr>
  </tbody>
</table>
    `,
  },
  {
    subject: 'system',
    subjectLabel: '시스템보안',
    chapter: 'system-attack',
    chapterLabel: '시스템 공격 기법',
    keywords: ['버퍼오버플로', '포맷스트링', '레이스컨디션', 'TOCTOU', '권한상승', '루트킷', '패스워드크래킹', 'Pass the Hash', 'NOP sled', '스택'],
    content: `
<h3>버퍼 오버플로 (Buffer Overflow)</h3>
<p>입력 데이터가 버퍼 크기를 초과해 인접 메모리를 덮어쓰는 공격. 스택의 리턴 주소를 공격자 코드로 덮어씁니다.</p>
<table>
  <thead><tr><th>구분</th><th>스택 기반</th><th>힙 기반</th></tr></thead>
  <tbody>
    <tr><td>대상</td><td>스택 상의 지역변수</td><td>동적 할당 메모리</td></tr>
    <tr><td>목표</td><td>리턴 주소 덮어쓰기</td><td>함수 포인터, vtable 덮어쓰기</td></tr>
    <tr><td>난이도</td><td>비교적 쉬움</td><td>어려움</td></tr>
  </tbody>
</table>

<h4>NOP Sled</h4>
<p>NOP(No Operation) 명령어(0x90)를 연속 배치해 셸코드 앞에 슬라이드 영역 생성. 정확한 리턴 주소 몰라도 NOP 영역 어딘가에 점프하면 셸코드 실행 가능.</p>

<h4>버퍼 오버플로 대응 기법</h4>
<table>
  <thead><tr><th>대응 기법</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td><strong>ASLR</strong> (Address Space Layout Randomization)</td><td>스택·힙·라이브러리 주소 무작위화 → 리턴 주소 예측 방해</td></tr>
    <tr><td><strong>DEP/NX</strong> (Data Execution Prevention)</td><td>스택·힙에서 코드 실행 금지</td></tr>
    <tr><td><strong>스택 카나리(Stack Canary)</strong></td><td>리턴 주소 앞에 카나리 값 배치. 리턴 전 카나리 변조 여부 확인.</td></tr>
    <tr><td><strong>SafeSEH</strong></td><td>SEH(구조적 예외 처리) 핸들러 포인터 검증 (Windows)</td></tr>
  </tbody>
</table>

<h3>포맷 스트링 공격 (Format String Attack)</h3>
<p>printf() 등 포맷 함수에 사용자 입력을 직접 포맷 문자열로 전달할 때 발생.</p>
<pre><code>취약 코드: printf(user_input);       // 위험
안전 코드: printf("%s", user_input); // 안전

%x : 스택 메모리 내용 출력 (정보 유출)
%n : 현재까지 출력한 바이트 수를 메모리에 쓰기 (임의 쓰기 가능)</code></pre>

<h3>레이스 컨디션 / TOCTOU</h3>
<p><strong>레이스 컨디션(Race Condition)</strong>: 두 프로세스가 공유 자원에 동시 접근해 결과가 실행 순서에 따라 달라지는 취약점.</p>
<p><strong>TOCTOU (Time-of-Check-to-Time-of-Use)</strong>: 권한 확인 시점(TOC)과 실제 사용 시점(TOU) 사이에 공격자가 파일 등 자원을 교체하는 공격.</p>
<pre><code>1. 프로그램이 /tmp/safe_file 권한 확인 (TOC)
2. 공격자가 /tmp/safe_file을 /etc/passwd로 심볼릭 링크 교체
3. 프로그램이 /tmp/safe_file에 쓰기 (TOU) → /etc/passwd 수정됨</code></pre>

<h3>권한 상승 기법</h3>
<ul>
  <li><strong>SetUID 악용</strong>: SUID 설정된 프로그램의 취약점을 이용해 root 권한 획득</li>
  <li><strong>커널 취약점 공격</strong>: dirty COW, ptrace 등 커널 버그 악용</li>
  <li><strong>sudo 설정 오류</strong>: sudoers 잘못된 설정으로 권한 상승</li>
  <li><strong>PATH 변조</strong>: 환경변수 PATH에 악성 디렉토리 삽입</li>
</ul>

<h3>루트킷 (Rootkit)</h3>
<p>시스템에 지속적으로 은닉하며 관리자 수준 접근을 유지하는 악성 소프트웨어.</p>
<table>
  <thead><tr><th>유형</th><th>동작 방식</th></tr></thead>
  <tbody>
    <tr><td>커널 레벨 루트킷</td><td>커널 모듈로 로드. 시스템 콜 테이블 후킹. 탐지 극히 어려움.</td></tr>
    <tr><td>사용자 레벨 루트킷</td><td>ls, ps 등 시스템 명령어 교체. 상대적으로 탐지 쉬움.</td></tr>
    <tr><td>부트킷</td><td>MBR/UEFI 감염. OS 로드 전 실행.</td></tr>
    <tr><td>하이퍼바이저 루트킷</td><td>가상화 레이어 활용. OS 아래에서 동작.</td></tr>
  </tbody>
</table>

<h3>패스워드 크래킹</h3>
<table>
  <thead><tr><th>기법</th><th>설명</th><th>대응</th></tr></thead>
  <tbody>
    <tr><td>무차별 대입(Brute-force)</td><td>모든 가능한 조합 시도</td><td>계정 잠금, 긴 패스워드</td></tr>
    <tr><td>사전 공격(Dictionary)</td><td>자주 쓰이는 단어 목록</td><td>복잡한 패스워드 정책</td></tr>
    <tr><td>Rainbow Table</td><td>사전계산된 해시 역조회</td><td>솔트(Salt) 사용</td></tr>
    <tr><td>하이브리드 공격</td><td>사전 단어 + 숫자·특수문자 조합</td><td>복잡한 패스워드</td></tr>
  </tbody>
</table>

<h3>Pass the Hash (PtH)</h3>
<p>Windows NTLM 인증에서 실제 패스워드 없이 <strong>NTLM 해시값만으로 인증</strong>하는 공격.</p>
<ul>
  <li>공격 도구: mimikatz, impacket</li>
  <li>대응: Kerberos 인증 사용, Protected Users 그룹 활용, 관리자 계정 최소화, Credential Guard</li>
</ul>

<h3>대응 방안 종합</h3>
<table>
  <thead><tr><th>공격 유형</th><th>주요 대응</th></tr></thead>
  <tbody>
    <tr><td>버퍼 오버플로</td><td>ASLR, DEP, 스택 카나리, 안전한 함수 사용(strncpy, snprintf)</td></tr>
    <tr><td>포맷 스트링</td><td>포맷 문자열에 사용자 입력 직접 사용 금지</td></tr>
    <tr><td>TOCTOU</td><td>파일 디스크립터 사용(open 후 fd로만 처리), 임시파일 안전한 생성(mkstemp)</td></tr>
    <tr><td>권한 상승</td><td>최소권한 원칙, 불필요한 SUID 파일 제거, 정기 패치</td></tr>
    <tr><td>루트킷</td><td>무결성 검사 도구(Tripwire), 신뢰 부트(Secure Boot), EDR</td></tr>
    <tr><td>Pass the Hash</td><td>Kerberos 강제, Credential Guard, 관리자 계정 분리</td></tr>
  </tbody>
</table>
    `,
  },

  // ===== 네트워크보안 =====
  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'network-basics',
    chapterLabel: '네트워크 기초',
    keywords: ['OSI', 'TCP', 'UDP', 'IP', 'ARP', 'DNS', 'DHCP', '라우터', '스위치', '포트', 'ICMP', 'HTTP', 'HTTPS', 'SYN', 'handshake', 'NAT', 'IPv6', '스니핑', 'ARP Spoofing'],
    content: `

<h3>OSI 7계층</h3>
<table>
  <thead><tr><th>계층</th><th>이름</th><th>주요 프로토콜·장비</th><th>데이터 단위</th><th>주요 공격</th></tr></thead>
  <tbody>
    <tr><td>7</td><td>응용(Application)</td><td>HTTP, FTP, SMTP, DNS, SNMP, Telnet</td><td>메시지</td><td>SQL Injection, XSS</td></tr>
    <tr><td>6</td><td>표현(Presentation)</td><td>SSL/TLS, JPEG, MPEG, ASCII</td><td>메시지</td><td>SSL Stripping</td></tr>
    <tr><td>5</td><td>세션(Session)</td><td>NetBIOS, RPC, SMB</td><td>메시지</td><td>세션 하이재킹</td></tr>
    <tr><td>4</td><td>전송(Transport)</td><td>TCP, UDP</td><td>세그먼트</td><td>SYN Flooding, 포트 스캔</td></tr>
    <tr><td>3</td><td>네트워크(Network)</td><td>IP, ICMP, OSPF, BGP, 라우터</td><td>패킷</td><td>IP Spoofing, Smurf</td></tr>
    <tr><td>2</td><td>데이터링크(Data Link)</td><td>Ethernet, MAC, ARP, PPP, 스위치</td><td>프레임</td><td>ARP Spoofing, MAC Flooding</td></tr>
    <tr><td>1</td><td>물리(Physical)</td><td>Hub, 케이블, 리피터, NIC</td><td>비트</td><td>도청(Eavesdropping)</td></tr>
  </tbody>
</table>

<h4>TCP/IP 4계층 (DoD 모델)</h4>
<table>
  <thead><tr><th>TCP/IP 계층</th><th>대응 OSI 계층</th><th>프로토콜</th></tr></thead>
  <tbody>
    <tr><td>응용(Application)</td><td>5~7계층</td><td>HTTP, FTP, SMTP, DNS, SSH, Telnet</td></tr>
    <tr><td>전송(Transport)</td><td>4계층</td><td>TCP, UDP</td></tr>
    <tr><td>인터넷(Internet)</td><td>3계층</td><td>IP, ICMP, ARP, RARP</td></tr>
    <tr><td>네트워크 액세스(Network Access)</td><td>1~2계층</td><td>Ethernet, Wi-Fi, PPP</td></tr>
  </tbody>
</table>

<h3>TCP vs UDP</h3>
<table>
  <thead><tr><th>구분</th><th>TCP</th><th>UDP</th></tr></thead>
  <tbody>
    <tr><td>연결</td><td>연결 지향 (3-way handshake)</td><td>비연결(Connectionless)</td></tr>
    <tr><td>신뢰성</td><td>높음 (순서 보장, 재전송, 흐름제어, 혼잡제어)</td><td>없음</td></tr>
    <tr><td>속도</td><td>상대적으로 느림</td><td>빠름</td></tr>
    <tr><td>헤더 크기</td><td>20~60byte</td><td>8byte</td></tr>
    <tr><td>주요 용도</td><td>HTTP(S), FTP, SMTP, SSH, Telnet</td><td>DNS, DHCP, VoIP, 스트리밍, SNMP</td></tr>
  </tbody>
</table>

<h3>TCP 연결 관리</h3>
<h4>3-way Handshake (연결 수립)</h4>
<pre><code>클라이언트 → [SYN, seq=x]          → 서버
클라이언트 ← [SYN+ACK, seq=y, ack=x+1] ← 서버
클라이언트 → [ACK, ack=y+1]        → 서버</code></pre>

<h4>4-way Handshake (연결 종료)</h4>
<pre><code>클라이언트 → [FIN] → 서버
클라이언트 ← [ACK] ← 서버
클라이언트 ← [FIN] ← 서버
클라이언트 → [ACK] → 서버   (TIME_WAIT 상태 진입)</code></pre>

<h4>TCP 플래그</h4>
<table>
  <thead><tr><th>플래그</th><th>의미</th></tr></thead>
  <tbody>
    <tr><td>SYN</td><td>연결 요청</td></tr>
    <tr><td>ACK</td><td>수신 확인</td></tr>
    <tr><td>FIN</td><td>연결 종료 요청</td></tr>
    <tr><td>RST</td><td>연결 강제 초기화</td></tr>
    <tr><td>PSH</td><td>즉시 전달 요청</td></tr>
    <tr><td>URG</td><td>긴급 데이터</td></tr>
  </tbody>
</table>

<h3>주요 프로토콜과 포트</h3>
<table>
  <thead><tr><th>프로토콜</th><th>포트</th><th>전송층</th><th>용도</th></tr></thead>
  <tbody>
    <tr><td>FTP (데이터)</td><td>20</td><td>TCP</td><td>파일 전송 데이터</td></tr>
    <tr><td>FTP (제어)</td><td>21</td><td>TCP</td><td>파일 전송 제어</td></tr>
    <tr><td>SSH</td><td>22</td><td>TCP</td><td>보안 원격 접속·터널링</td></tr>
    <tr><td>Telnet</td><td>23</td><td>TCP</td><td>원격 접속 (평문, 보안 취약)</td></tr>
    <tr><td>SMTP</td><td>25</td><td>TCP</td><td>메일 송신</td></tr>
    <tr><td>DNS</td><td>53</td><td>UDP/TCP</td><td>도메인 이름 해석</td></tr>
    <tr><td>DHCP (서버→클라)</td><td>67</td><td>UDP</td><td>IP 자동 할당</td></tr>
    <tr><td>DHCP (클라→서버)</td><td>68</td><td>UDP</td><td>IP 자동 할당</td></tr>
    <tr><td>TFTP</td><td>69</td><td>UDP</td><td>단순 파일 전송</td></tr>
    <tr><td>HTTP</td><td>80</td><td>TCP</td><td>웹</td></tr>
    <tr><td>POP3</td><td>110</td><td>TCP</td><td>메일 수신 (서버 삭제)</td></tr>
    <tr><td>IMAP</td><td>143</td><td>TCP</td><td>메일 수신 (서버 유지, 동기화)</td></tr>
    <tr><td>HTTPS</td><td>443</td><td>TCP</td><td>보안 웹(TLS)</td></tr>
    <tr><td>SMTPS</td><td>465/587</td><td>TCP</td><td>보안 메일 송신</td></tr>
    <tr><td>SNMP</td><td>161</td><td>UDP</td><td>네트워크 장비 관리</td></tr>
    <tr><td>LDAP</td><td>389</td><td>TCP/UDP</td><td>디렉토리 서비스</td></tr>
    <tr><td>LDAPS</td><td>636</td><td>TCP</td><td>보안 LDAP(TLS)</td></tr>
    <tr><td>SMB</td><td>445</td><td>TCP</td><td>파일 공유 (Windows)</td></tr>
    <tr><td>RDP</td><td>3389</td><td>TCP</td><td>원격 데스크톱</td></tr>
  </tbody>
</table>

<h3>주요 프로토콜 동작</h3>

<h4>ARP (Address Resolution Protocol)</h4>
<p>IP 주소 → MAC 주소 변환. 3계층 프로토콜이지만 2계층 주소 해석에 사용. ARP 캐시(ARP 테이블)에 결과 저장.</p>
<ul>
  <li><strong>RARP</strong>: MAC → IP 변환. DHCP 이전 사용.</li>
  <li><strong>Proxy ARP</strong>: 라우터가 다른 서브넷 대신 ARP 응답.</li>
  <li><strong>Gratuitous ARP</strong>: 자신의 IP-MAC을 네트워크에 알림 (중복 탐지·캐시 갱신).</li>
</ul>

<h4>ICMP (Internet Control Message Protocol)</h4>
<p>IP 네트워크 오류 메시지·제어 메시지 전달. 라우터가 TTL 초과, 목적지 도달 불가 등 알림.</p>
<ul>
  <li>Type 0: Echo Reply (ping 응답)</li>
  <li>Type 3: Destination Unreachable</li>
  <li>Type 8: Echo Request (ping 요청)</li>
  <li>Type 11: TTL Exceeded</li>
  <li>악용: Ping of Death, Smurf 공격, ICMP Tunneling</li>
</ul>

<h4>DNS (Domain Name System)</h4>
<ul>
  <li>도메인 → IP 변환. 계층 구조: 루트 → TLD → 2차 도메인 → 호스트.</li>
  <li>레코드 유형: A(IPv4), AAAA(IPv6), MX(메일), CNAME(별칭), NS(네임서버), PTR(역방향), SOA(권한 시작)</li>
  <li><strong>DNS Spoofing(캐시 포이즈닝)</strong>: 위조된 DNS 응답으로 캐시 오염 → 사용자를 악성 사이트로 유도.</li>
  <li><strong>DNSSEC</strong>: DNS 응답 디지털 서명으로 위변조 방지.</li>
</ul>

<h4>DHCP (Dynamic Host Configuration Protocol)</h4>
<p>IP 주소·서브넷 마스크·게이트웨이·DNS 자동 할당. 과정: <strong>DORA</strong> (Discover → Offer → Request → ACK)</p>
<ul>
  <li><strong>DHCP Starvation</strong>: 가짜 요청으로 IP 풀 고갈 → DoS.</li>
  <li><strong>DHCP Spoofing</strong>: 가짜 DHCP 서버로 악성 게이트웨이 할당 → MITM.</li>
</ul>

<h3>IP 주소 체계</h3>
<h4>IPv4 사설 주소 (RFC 1918)</h4>
<table>
  <thead><tr><th>클래스</th><th>사설 IP 대역</th><th>호스트 수</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>10.0.0.0 ~ 10.255.255.255 (/8)</td><td>약 1,677만</td></tr>
    <tr><td>B</td><td>172.16.0.0 ~ 172.31.255.255 (/12)</td><td>약 104만</td></tr>
    <tr><td>C</td><td>192.168.0.0 ~ 192.168.255.255 (/16)</td><td>약 65,536</td></tr>
  </tbody>
</table>

<h4>특수 주소</h4>
<ul>
  <li><code>127.0.0.1</code>: 루프백 (자기 자신)</li>
  <li><code>0.0.0.0</code>: 모든 주소 또는 미지정</li>
  <li><code>255.255.255.255</code>: 제한된 브로드캐스트</li>
  <li><code>169.254.0.0/16</code>: APIPA (DHCP 실패 시 자동 할당)</li>
</ul>

<h4>IPv6 특징</h4>
<ul>
  <li>128bit 주소 (16진수 8그룹, 콜론 구분). 2^128개 주소.</li>
  <li>IPSec 기본 내장 (IPv4는 선택적)</li>
  <li>헤더 단순화 (체크섬 제거, 가변 헤더 확장)</li>
  <li>멀티캐스트, 애니캐스트 지원. 브로드캐스트 없음.</li>
  <li><code>::1</code>: 루프백. <code>fe80::/10</code>: 링크-로컬.</li>
</ul>

<h3>네트워크 공격</h3>
<h4>스니핑(Sniffing)</h4>
<p>네트워크 패킷을 가로채 내용 도청. Promiscuous Mode로 NIC 설정. 허브 환경에서 쉬움. 스위치 환경: ARP Spoofing + 스니핑 조합.</p>

<h4>ARP Spoofing</h4>
<p>위조된 ARP Reply로 피해자의 ARP 캐시 오염 → 트래픽을 공격자 경유. MITM 기반. IP Forwarding 설정 시 투명하게 가로채기.</p>

<h4>IP Spoofing</h4>
<p>출발지 IP를 위조한 패킷 전송. Smurf 공격, SYN Flooding 등에 활용. 단방향 공격(응답 불가).</p>

<h4>세션 하이재킹</h4>
<p>TCP 세션의 시퀀스 번호를 예측·탈취해 연결 가로채기. ARP Spoofing으로 패킷 확보 후 시퀀스 번호 파악.</p>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'firewall-ids',
    chapterLabel: '방화벽·IDS·IPS',
    keywords: ['방화벽', 'IDS', 'IPS', '침입탐지', '패킷 필터링', '상태 검사', '애플리케이션 게이트웨이', '프록시', 'DMZ', '오탐', '미탐', 'UTM', 'NGFW', 'WAF', 'NAC', '허니팟'],
    content: `

<h3>방화벽 (Firewall)</h3>
<p>내부 네트워크와 외부 네트워크 사이에서 정의된 규칙에 따라 <strong>트래픽을 허용/차단</strong>하는 보안 장비. 기본 원칙: <strong>화이트리스트(허용 목록)</strong> 기반 (미정의 트래픽은 거부).</p>

<h4>방화벽 유형 비교</h4>
<table>
  <thead><tr><th>유형</th><th>동작 계층</th><th>검사 항목</th><th>장점</th><th>단점</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>패킷 필터링</strong><br>(1세대)</td>
      <td>3~4계층</td>
      <td>IP, 포트, 프로토콜</td>
      <td>빠름, 저렴</td>
      <td>상태 추적 불가, 분할 패킷 우회</td>
    </tr>
    <tr>
      <td><strong>상태 검사</strong><br>(Stateful Inspection, 2세대)</td>
      <td>3~4계층</td>
      <td>IP, 포트 + 연결 상태 테이블</td>
      <td>동적 패킷 분석</td>
      <td>응용 계층 내용 미검사</td>
    </tr>
    <tr>
      <td><strong>애플리케이션 게이트웨이</strong><br>(프록시 방화벽, 3세대)</td>
      <td>7계층</td>
      <td>응용 계층 내용</td>
      <td>내용 기반 필터링, IP 은닉</td>
      <td>속도 느림, 모든 프로토콜 지원 어려움</td>
    </tr>
    <tr>
      <td><strong>NGFW</strong><br>(차세대 방화벽)</td>
      <td>7계층</td>
      <td>DPI, 앱 인식, SSL 검사, IPS</td>
      <td>복합 위협 대응</td>
      <td>고가, 복잡</td>
    </tr>
  </tbody>
</table>

<h4>방화벽 구성 유형</h4>
<ul>
  <li><strong>스크리닝 라우터</strong>: 라우터에 패킷 필터링 ACL 적용. 단순.</li>
  <li><strong>배스천 호스트(Bastion Host)</strong>: 외부 접근 허용되는 강화된 서버. 프록시 역할.</li>
  <li><strong>듀얼홈 게이트웨이</strong>: NIC 2개. IP Forwarding 비활성화. 직접 트래픽 차단.</li>
  <li><strong>스크린드 서브넷(DMZ)</strong>: 외부 방화벽 + DMZ + 내부 방화벽. 가장 안전.</li>
</ul>

<h3>DMZ (비무장지대)</h3>
<p>외부 인터넷과 내부망 사이의 중간 영역. 외부에서 접근 필요한 서버(웹·메일·DNS·FTP)를 배치해 내부망 직접 노출 방지.</p>
<pre><code>인터넷 ← 외부방화벽 → [DMZ: 웹서버, 메일서버] ← 내부방화벽 → 내부망</code></pre>

<h3>IDS (침입탐지시스템)</h3>
<p>네트워크/호스트의 이벤트를 분석해 <strong>침입 탐지 후 경보</strong> 발송. 차단 기능 없음 (수동적).</p>

<h4>탐지 방식</h4>
<table>
  <thead><tr><th>방식</th><th>원리</th><th>장점</th><th>단점</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>시그니처(오용) 탐지</strong><br>Misuse Detection</td>
      <td>알려진 공격 패턴 DB와 비교</td>
      <td>정탐률 높음, 오탐 낮음</td>
      <td>알려진 공격만 탐지. 신종·변종 취약.</td>
    </tr>
    <tr>
      <td><strong>이상(행위) 탐지</strong><br>Anomaly Detection</td>
      <td>정상 프로파일 기준 이상 행위 탐지</td>
      <td>신종 공격 탐지 가능</td>
      <td>오탐률 높음. 프로파일 구축 필요.</td>
    </tr>
    <tr>
      <td><strong>상태 기반 탐지</strong></td>
      <td>프로토콜 상태 머신 위반 탐지</td>
      <td>프로토콜 이상 탐지</td>
      <td>복잡</td>
    </tr>
  </tbody>
</table>

<h4>배치 유형</h4>
<table>
  <thead><tr><th>구분</th><th>NIDS (네트워크 기반)</th><th>HIDS (호스트 기반)</th></tr></thead>
  <tbody>
    <tr><td>위치</td><td>네트워크 구간 (TAP/SPAN 포트)</td><td>개별 호스트에 에이전트</td></tr>
    <tr><td>탐지</td><td>네트워크 트래픽 분석</td><td>로그, 시스템 콜, 파일 무결성</td></tr>
    <tr><td>암호화 트래픽</td><td>탐지 어려움</td><td>복호화 후 분석 가능</td></tr>
    <tr><td>장점</td><td>단일 지점에서 전체 모니터링</td><td>내부 공격·내부자 위협 탐지</td></tr>
  </tbody>
</table>

<h4>탐지 판정 유형 (혼동 행렬)</h4>
<table>
  <thead><tr><th></th><th>실제 공격 (Positive)</th><th>정상 (Negative)</th></tr></thead>
  <tbody>
    <tr><td><strong>공격으로 탐지</strong></td><td>정탐 (TP, True Positive)</td><td>오탐 (FP, False Positive) — 경보 과다</td></tr>
    <tr><td><strong>정상으로 탐지</strong></td><td>미탐 (FN, False Negative) — 보안 위험</td><td>정상 탐지 (TN, True Negative)</td></tr>
  </tbody>
</table>
<ul>
  <li><strong>임계값 낮추면</strong>: 탐지율(민감도) 상승, 오탐률 상승</li>
  <li><strong>임계값 높이면</strong>: 탐지율 하강, 오탐률 하강 (미탐 증가)</li>
</ul>

<h3>IPS (침입방지시스템)</h3>
<p>IDS 기능 + <strong>실시간 자동 차단</strong>. 인라인(Inline) 방식으로 배치 (트래픽 경로에 직접 위치). 오탐 시 정상 트래픽도 차단되는 위험.</p>

<h3>IDS vs IPS vs 방화벽</h3>
<table>
  <thead><tr><th>구분</th><th>방화벽</th><th>IDS</th><th>IPS</th></tr></thead>
  <tbody>
    <tr><td>목적</td><td>접근 통제</td><td>침입 탐지·경보</td><td>침입 탐지·차단</td></tr>
    <tr><td>배치</td><td>인라인</td><td>Out-of-band (미러링)</td><td>인라인</td></tr>
    <tr><td>트래픽 차단</td><td>O (정책 기반)</td><td>X</td><td>O (자동)</td></tr>
    <tr><td>오탐 영향</td><td>낮음</td><td>경보만</td><td>정상 트래픽 차단</td></tr>
  </tbody>
</table>

<h3>기타 네트워크 보안 장비</h3>
<ul>
  <li><strong>WAF (Web Application Firewall)</strong>: HTTP/HTTPS 트래픽 분석. SQL Injection·XSS·CSRF 등 웹 공격 방어. OSI 7계층.</li>
  <li><strong>UTM (Unified Threat Management)</strong>: 방화벽 + IPS + 안티바이러스 + VPN + 콘텐츠 필터 통합. 중소기업에 적합.</li>
  <li><strong>NAC (Network Access Control)</strong>: 단말 보안 상태 검사 후 네트워크 접근 허용/격리. 802.1X 기반.</li>
  <li><strong>DDoS 방어 장비</strong>: 트래픽 분석·스크러빙. 블랙홀 라우팅, CDN 활용.</li>
</ul>

<h3>허니팟 (Honeypot)</h3>
<p>공격자를 유인하는 <strong>함정 시스템</strong>. 공격 기법 수집·분석 목적. 실제 서비스 없음.</p>
<ul>
  <li><strong>허니넷(Honeynet)</strong>: 여러 허니팟을 네트워크로 구성.</li>
  <li>주의: 공격자가 허니팟을 이용해 제3자 공격 시 법적 문제.</li>
</ul>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'vpn',
    chapterLabel: 'VPN',
    keywords: ['VPN', 'IPSec', 'SSL VPN', 'PPTP', 'L2TP', '터널링', '암호화', 'AH', 'ESP', 'IKE', 'TLS', 'SSL', 'POODLE', 'BEAST', 'SA'],
    content: `

<p>공중망(인터넷)을 통해 <strong>암호화된 가상 사설 터널</strong>을 구성하는 기술. 기밀성·무결성·인증·부인방지 제공.</p>

<h3>VPN 유형 비교</h3>
<table>
  <thead><tr><th>유형</th><th>동작 계층</th><th>특징</th><th>주요 용도</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>IPSec VPN</strong></td>
      <td>3계층 (네트워크)</td>
      <td>강력한 보안. 별도 클라이언트 필요. 전송·터널 두 모드.</td>
      <td>LAN-to-LAN (사이트 간)</td>
    </tr>
    <tr>
      <td><strong>SSL/TLS VPN</strong></td>
      <td>4~7계층 (전송~응용)</td>
      <td>브라우저 또는 경량 클라이언트. 방화벽 친화적(443포트). 세밀한 접근 제어.</td>
      <td>원격 접근 (개별 사용자)</td>
    </tr>
    <tr>
      <td><strong>PPTP</strong></td>
      <td>2계층</td>
      <td>MS 개발(1999). GRE 터널 + PPP. 암호화 취약(MS-CHAPv2). 사용 금지 권고.</td>
      <td>레거시 환경</td>
    </tr>
    <tr>
      <td><strong>L2TP</strong></td>
      <td>2계층</td>
      <td>PPTP(MS) + L2F(Cisco) 결합. 단독으로 암호화 없음 → <strong>L2TP/IPSec</strong>으로 사용.</td>
      <td>원격 접근</td>
    </tr>
    <tr>
      <td><strong>OpenVPN</strong></td>
      <td>응용 계층</td>
      <td>오픈소스. TLS 기반. 방화벽 우회 용이. 유연성 높음.</td>
      <td>개인·기업 원격 접근</td>
    </tr>
    <tr>
      <td><strong>WireGuard</strong></td>
      <td>3~4계층</td>
      <td>최신 경량 프로토콜. ChaCha20 암호화. 코드 단순.</td>
      <td>고성능 VPN</td>
    </tr>
  </tbody>
</table>

<h3>IPSec 구성 요소</h3>

<h4>프로토콜</h4>
<table>
  <thead><tr><th>프로토콜</th><th>프로토콜 번호</th><th>인증</th><th>무결성</th><th>암호화</th><th>특징</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>AH</strong><br>(Authentication Header)</td>
      <td>51</td>
      <td>O</td>
      <td>O</td>
      <td>X</td>
      <td>IP 헤더 포함 서명. NAT 통과 불가(IP 헤더 변경). 무결성·인증만.</td>
    </tr>
    <tr>
      <td><strong>ESP</strong><br>(Encapsulating Security Payload)</td>
      <td>50</td>
      <td>O</td>
      <td>O</td>
      <td>O</td>
      <td>페이로드 암호화 + 선택적 인증. NAT 통과 가능. 실무에서 주로 사용.</td>
    </tr>
  </tbody>
</table>

<h4>IKE (Internet Key Exchange)</h4>
<p>SA(Security Association) 협상 및 키 교환 프로토콜. UDP 500번 포트. NAT 통과 시 UDP 4500.</p>
<ul>
  <li><strong>IKEv1</strong>: Phase 1 (ISAKMP SA) + Phase 2 (IPSec SA). 복잡.</li>
  <li><strong>IKEv2</strong>: 단순화, 더 빠름, 모바일 지원(MOBIKE), EAP 지원.</li>
</ul>

<h4>SA (Security Association)</h4>
<ul>
  <li>보안 연결의 파라미터 집합: 암호화 알고리즘, 해시 알고리즘, 키, 수명(Lifetime)</li>
  <li><strong>단방향</strong>: 양방향 통신 = 2개의 SA 필요</li>
  <li>SPI (Security Parameter Index): SA를 식별하는 32bit 값</li>
  <li>SAD (SA Database): 활성 SA 목록 저장</li>
  <li>SPD (Security Policy Database): 어떤 트래픽에 IPSec 적용할지 정책 저장</li>
</ul>

<h3>IPSec 동작 모드</h3>
<table>
  <thead><tr><th>모드</th><th>헤더 처리</th><th>보호 범위</th><th>용도</th><th>오버헤드</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>전송 모드(Transport)</strong></td>
      <td>원본 IP 헤더 유지</td>
      <td>페이로드만 보호 (IP 헤더 노출)</td>
      <td>Host-to-Host 종단 간</td>
      <td>낮음</td>
    </tr>
    <tr>
      <td><strong>터널 모드(Tunnel)</strong></td>
      <td>원본 패킷 전체 캡슐화 + 새 IP 헤더</td>
      <td>원본 IP 헤더 포함 전체 보호</td>
      <td>Gateway-to-Gateway (LAN-to-LAN)</td>
      <td>높음</td>
    </tr>
  </tbody>
</table>

<h3>TLS/SSL</h3>

<h4>버전별 상태</h4>
<table>
  <thead><tr><th>버전</th><th>상태</th><th>주요 취약점</th></tr></thead>
  <tbody>
    <tr><td>SSL 2.0</td><td>사용 금지</td><td>DROWN</td></tr>
    <tr><td>SSL 3.0</td><td>사용 금지</td><td>POODLE</td></tr>
    <tr><td>TLS 1.0</td><td>사용 금지 권고</td><td>BEAST, POODLE</td></tr>
    <tr><td>TLS 1.1</td><td>사용 금지 권고</td><td>BEAST</td></tr>
    <tr><td>TLS 1.2</td><td>현재 사용</td><td>SWEET32 (약한 암호 스위트)</td></tr>
    <tr><td>TLS 1.3</td><td>권장 표준</td><td>-</td></tr>
  </tbody>
</table>

<h4>TLS Handshake (TLS 1.2)</h4>
<pre><code>1. ClientHello: 지원 암호 스위트, 랜덤값
2. ServerHello: 선택 암호 스위트, 랜덤값, 인증서
3. 클라이언트: 인증서 검증, Pre-Master Secret 생성·전송
4. 양측: Master Secret 도출 → 세션키 생성
5. Finished: 핸드셰이크 완료
6. 대칭키 암호화 통신 시작</code></pre>

<h4>TLS 1.3 개선사항</h4>
<ul>
  <li>1-RTT Handshake (1.2는 2-RTT)</li>
  <li>0-RTT 재개 (Session Resumption)</li>
  <li>취약 암호 스위트 제거: RC4, DES, 3DES, MD5, SHA-1 제거</li>
  <li>순방향 비밀성(PFS) 필수: DHE/ECDHE만 허용</li>
  <li>정적 RSA 키 교환 제거</li>
</ul>

<h4>순방향 비밀성 (PFS, Perfect Forward Secrecy)</h4>
<p>세션키 유출 시 과거 통신 복호화 불가. 세션마다 임시 DH 키 생성(DHE/ECDHE). 장기 개인키 유출로도 과거 세션 복호화 불가.</p>

<h4>주요 TLS 공격</h4>
<ul>
  <li><strong>BEAST</strong>: TLS 1.0 CBC 모드 IV 예측 공격. → TLS 1.1+ 또는 RC4(현재 금지) 사용.</li>
  <li><strong>POODLE</strong>: SSL 3.0 CBC 패딩 오라클. SSL 3.0 → TLS 다운그레이드 강제. → SSL 3.0 비활성화.</li>
  <li><strong>DROWN</strong>: SSL 2.0 활성화 서버를 이용한 TLS 세션 복호화.</li>
  <li><strong>Heartbleed</strong>: OpenSSL HeartBeat 확장 버퍼 오버리드. 메모리 64KB 노출.</li>
  <li><strong>FREAK</strong>: 수출용 약한 RSA 키(512bit) 강제 다운그레이드.</li>
  <li><strong>LOGJAM</strong>: Diffie-Hellman 512bit로 다운그레이드.</li>
</ul>
    `,
  },

  // ===== 어플리케이션보안 =====
  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'web-security',
    chapterLabel: '웹 보안',
    keywords: ['SQL injection', 'XSS', 'CSRF', '세션', '쿠키', '디렉토리 트래버설', 'OWASP', '파일 업로드', 'Command injection', 'XXE', 'Clickjacking', 'SSRF', '웹셸', 'Prepared Statement'],
    content: `

<h3>OWASP Top 10 (2021)</h3>
<ol>
  <li>취약한 접근 통제 (Broken Access Control)</li>
  <li>암호화 실패 (Cryptographic Failures)</li>
  <li>인젝션 (Injection) — SQL·OS·LDAP</li>
  <li>안전하지 않은 설계 (Insecure Design)</li>
  <li>보안 설정 오류 (Security Misconfiguration)</li>
  <li>취약하고 오래된 구성요소 (Vulnerable and Outdated Components)</li>
  <li>식별 및 인증 실패 (Identification and Authentication Failures)</li>
  <li>소프트웨어 및 데이터 무결성 실패 (Software and Data Integrity Failures)</li>
  <li>보안 로깅 및 모니터링 실패 (Security Logging and Monitoring Failures)</li>
  <li>서버 측 요청 위조 (SSRF)</li>
</ol>

<h3>주요 웹 취약점</h3>

<h4>SQL Injection</h4>
<p>입력값에 SQL 구문을 삽입해 DB를 비정상 조작하는 공격. 데이터 유출·변조·삭제·인증 우회 가능.</p>
<pre><code>-- 로그인 우회 (WHERE 조건 항상 참)
ID 입력: admin'--
쿼리: SELECT * FROM users WHERE id='admin'--' AND pw='...'

-- UNION SELECT로 타 테이블 데이터 추출
' UNION SELECT username, password FROM admin--</code></pre>

<h4>SQL Injection 유형</h4>
<table>
  <thead><tr><th>유형</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td><strong>In-band (Error-based)</strong></td><td>오류 메시지로 DB 정보 추출. 응답에 오류 직접 포함.</td></tr>
    <tr><td><strong>In-band (Union-based)</strong></td><td>UNION SELECT로 다른 테이블 데이터를 응답에 포함.</td></tr>
    <tr><td><strong>Blind (Boolean-based)</strong></td><td>참/거짓 응답 차이로 정보를 1비트씩 추출. 느림.</td></tr>
    <tr><td><strong>Blind (Time-based)</strong></td><td>응답 지연 시간으로 정보 추출 (SLEEP(), WAITFOR DELAY).</td></tr>
    <tr><td><strong>Out-of-band</strong></td><td>DNS/HTTP 채널로 결과 외부 전송. 방화벽 우회.</td></tr>
  </tbody>
</table>
<p><strong>대응</strong>: Prepared Statement(파라미터 바인딩), 입력 검증, 최소 권한 DB 계정, 오류 메시지 노출 금지, WAF.</p>

<h4>XSS (Cross-Site Scripting)</h4>
<p>악성 스크립트를 웹 페이지에 삽입해 다른 사용자 브라우저에서 실행. 쿠키 탈취·키로깅·피싱·페이지 변조.</p>
<table>
  <thead><tr><th>유형</th><th>저장</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td><strong>Stored XSS</strong> (영구적)</td><td>DB에 저장</td><td>게시판·댓글에 스크립트 삽입. 불특정 다수 피해.</td></tr>
    <tr><td><strong>Reflected XSS</strong> (비영구적)</td><td>저장 안 됨</td><td>URL 파라미터로 전달·즉시 응답. 피싱 링크로 유도.</td></tr>
    <tr><td><strong>DOM-based XSS</strong></td><td>저장 안 됨</td><td>서버 응답 무관. 클라이언트 JS가 URL의 해시(#)·파라미터를 DOM에 직접 삽입.</td></tr>
  </tbody>
</table>
<p><strong>대응</strong>: 출력 인코딩(HTML Entity: &lt; &gt; &amp; &quot;), CSP 헤더, HttpOnly 쿠키, 입력 검증.</p>

<h4>CSRF (Cross-Site Request Forgery)</h4>
<p>인증된 사용자의 브라우저를 이용해 의도하지 않은 요청을 서버에 전송. 서버는 정상 요청으로 처리.</p>
<pre><code>공격 시나리오:
1. 피해자: 은행 사이트 로그인 (세션 쿠키 보유)
2. 공격자: 악성 페이지에 &lt;img src="bank.com/transfer?to=attacker&amount=1000000"&gt; 삽입
3. 피해자: 악성 페이지 방문 → 브라우저가 자동으로 은행에 이체 요청 (쿠키 자동 전송)</code></pre>
<ul>
  <li>XSS는 사용자(클라이언트)를 공격, CSRF는 서버를 공격(사용자를 매개로)</li>
</ul>
<p><strong>대응</strong>: CSRF 토큰 (요청마다 고유 값 검증), SameSite=Strict/Lax 쿠키, Referer/Origin 헤더 검증, CAPTCHA.</p>

<h4>세션 관련 공격</h4>
<table>
  <thead><tr><th>공격</th><th>방법</th><th>대응</th></tr></thead>
  <tbody>
    <tr><td><strong>세션 하이재킹</strong></td><td>세션 ID 스니핑·XSS로 탈취 후 위장 접근</td><td>HTTPS, HttpOnly+Secure 쿠키, 세션 ID 노출 최소화</td></tr>
    <tr><td><strong>세션 고정(Session Fixation)</strong></td><td>공격자가 세션 ID 미리 설정 → 피해자가 같은 ID로 로그인</td><td>로그인 후 세션 ID 반드시 재생성</td></tr>
    <tr><td><strong>세션 예측</strong></td><td>취약한 세션 ID 생성 알고리즘 역이용</td><td>충분한 엔트로피의 랜덤 세션 ID</td></tr>
  </tbody>
</table>

<h4>파일 업로드 취약점</h4>
<p>악성 파일(웹셸, .php/.jsp 등)을 서버에 업로드 후 실행해 원격 코드 실행(RCE).</p>
<ul>
  <li><strong>웹셸(Web Shell)</strong>: 웹을 통해 OS 명령 실행 가능한 스크립트. 공격자 지속 접근 수단.</li>
</ul>
<p><strong>대응</strong>: 화이트리스트 확장자 검증, MIME 타입 검증(Content-Type), 매직 바이트 확인, 실행 권한 없는 디렉토리에 저장, 파일명 난수화, 크기 제한.</p>

<h4>디렉토리 트래버설 (Path Traversal)</h4>
<p><code>../</code> 또는 URL 인코딩(<code>%2e%2e%2f</code>)으로 웹 루트 외부 파일 접근.</p>
<pre><code>http://example.com/view?file=../../../../etc/passwd
http://example.com/view?file=%2e%2e%2f%2e%2e%2fetc%2fpasswd</code></pre>
<p><strong>대응</strong>: 경로 정규화 후 기준 디렉토리 검증, 화이트리스트 파일명, 절대 경로 사용 금지.</p>

<h4>Command Injection</h4>
<p>OS 명령을 실행하는 함수에 악성 명령 삽입. <code>system()</code>, <code>exec()</code>, <code>popen()</code> 등.</p>
<pre><code>입력: 127.0.0.1; cat /etc/passwd
코드: system("ping " + input)
실행: ping 127.0.0.1; cat /etc/passwd</code></pre>
<p><strong>대응</strong>: OS 명령 실행 함수 사용 금지, 불가피 시 화이트리스트 입력 검증, escapeshellarg() 사용.</p>

<h4>XXE (XML External Entity)</h4>
<p>외부 엔티티 참조를 악용해 서버 내부 파일 읽기·SSRF·DoS 유발.</p>
<pre><code>&lt;!DOCTYPE foo [&lt;!ENTITY xxe SYSTEM "file:///etc/passwd"&gt;]&gt;
&lt;root&gt;&amp;xxe;&lt;/root&gt;</code></pre>
<p><strong>대응</strong>: 외부 엔티티 처리 비활성화, 안전한 XML 파서 사용.</p>

<h4>SSRF (Server-Side Request Forgery)</h4>
<p>서버가 공격자가 지정한 URL로 요청을 보내게 만들어 내부망 접근·클라우드 메타데이터 탈취.</p>
<p><strong>대응</strong>: 허용 URL 화이트리스트, 내부 IP 대역 차단, 클라우드 메타데이터 엔드포인트 접근 제한.</p>

<h3>HTTP 보안 헤더</h3>
<table>
  <thead><tr><th>헤더</th><th>목적</th><th>예시 값</th></tr></thead>
  <tbody>
    <tr><td><strong>Content-Security-Policy (CSP)</strong></td><td>XSS·인젝션 방지. 허용 리소스 출처 제한.</td><td><code>default-src 'self'</code></td></tr>
    <tr><td><strong>X-Frame-Options</strong></td><td>Clickjacking 방지. iframe 내 로딩 제한.</td><td><code>DENY</code> 또는 <code>SAMEORIGIN</code></td></tr>
    <tr><td><strong>Strict-Transport-Security (HSTS)</strong></td><td>HTTPS 강제. HTTP → HTTPS 자동 전환.</td><td><code>max-age=31536000; includeSubDomains</code></td></tr>
    <tr><td><strong>X-Content-Type-Options</strong></td><td>MIME 스니핑 방지.</td><td><code>nosniff</code></td></tr>
    <tr><td><strong>Referrer-Policy</strong></td><td>Referer 헤더 전송 범위 제어.</td><td><code>strict-origin-when-cross-origin</code></td></tr>
    <tr><td><strong>Permissions-Policy</strong></td><td>브라우저 기능(카메라·마이크 등) 제한.</td><td><code>camera=(), microphone=()</code></td></tr>
  </tbody>
</table>

<h3>쿠키 보안 속성</h3>
<table>
  <thead><tr><th>속성</th><th>효과</th></tr></thead>
  <tbody>
    <tr><td><strong>HttpOnly</strong></td><td>JavaScript에서 쿠키 접근 불가 → XSS로 탈취 방지</td></tr>
    <tr><td><strong>Secure</strong></td><td>HTTPS에서만 전송</td></tr>
    <tr><td><strong>SameSite=Strict</strong></td><td>같은 사이트 요청에만 전송 → CSRF 방지</td></tr>
    <tr><td><strong>SameSite=Lax</strong></td><td>GET 탐색 요청은 허용, POST 등 차단</td></tr>
    <tr><td><strong>SameSite=None; Secure</strong></td><td>크로스 사이트 허용 (HTTPS 필수)</td></tr>
  </tbody>
</table>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'db-security',
    chapterLabel: 'DB 보안',
    keywords: ['데이터베이스', 'DB', '뷰', '역할', '감사', '추론', '집계', '다단계 보안', '암호화', '접근통제', 'GRANT', 'REVOKE', 'TDE', 'DAM', '개인정보'],
    content: `

<h3>DB 보안 3대 요소</h3>
<table>
  <thead><tr><th>요소</th><th>설명</th><th>위협 예시</th></tr></thead>
  <tbody>
    <tr><td><strong>기밀성</strong></td><td>인가된 사용자만 데이터 접근</td><td>SQL Injection, 권한 상승</td></tr>
    <tr><td><strong>무결성</strong></td><td>데이터의 정확성·일관성 유지</td><td>비인가 변조, 트랜잭션 실패</td></tr>
    <tr><td><strong>가용성</strong></td><td>인가된 사용자가 필요할 때 접근</td><td>DoS, 서비스 장애</td></tr>
  </tbody>
</table>

<h3>SQL 명령어 분류</h3>
<table>
  <thead><tr><th>분류</th><th>명령어</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td><strong>DDL</strong> (Data Definition Language)</td><td>CREATE, ALTER, DROP, TRUNCATE, RENAME</td><td>스키마·구조 정의</td></tr>
    <tr><td><strong>DML</strong> (Data Manipulation Language)</td><td>SELECT, INSERT, UPDATE, DELETE, MERGE</td><td>데이터 조작</td></tr>
    <tr><td><strong>DCL</strong> (Data Control Language)</td><td>GRANT, REVOKE</td><td>권한 부여·회수</td></tr>
    <tr><td><strong>TCL</strong> (Transaction Control Language)</td><td>COMMIT, ROLLBACK, SAVEPOINT</td><td>트랜잭션 제어</td></tr>
  </tbody>
</table>

<h3>DB 접근통제</h3>
<h4>계정·권한 관리</h4>
<ul>
  <li><strong>최소 권한 원칙</strong>: 애플리케이션 계정에 SELECT만 필요하면 SELECT만 부여. DBA 계정 일반 작업 사용 금지.</li>
  <li><strong>계정 분리</strong>: DBA 계정, 운영 계정, 읽기 전용 계정 분리.</li>
  <li><strong>기본 계정 비활성화</strong>: sa(SQL Server), sys/system(Oracle), root(MySQL) 기본 패스워드 즉시 변경.</li>
</ul>

<h4>GRANT / REVOKE</h4>
<pre><code>-- 권한 부여
GRANT SELECT, INSERT ON orders TO appuser;
GRANT SELECT ON salary TO manager WITH GRANT OPTION;

-- 권한 회수
REVOKE INSERT ON orders FROM appuser;
REVOKE SELECT ON salary FROM manager CASCADE;</code></pre>
<ul>
  <li><strong>WITH GRANT OPTION</strong>: 받은 권한을 타인에게도 부여 가능</li>
  <li><strong>CASCADE</strong>: 위임한 권한까지 연쇄 회수</li>
</ul>

<h4>뷰(View)를 이용한 접근 제어</h4>
<p>특정 열·행만 노출하는 가상 테이블로 민감 데이터 접근 제한.</p>
<pre><code>-- 급여 정보 제외한 뷰 생성
CREATE VIEW emp_public AS
  SELECT emp_id, name, dept FROM employees;

-- 특정 부서 데이터만 노출
CREATE VIEW my_dept_view AS
  SELECT * FROM employees WHERE dept = CURRENT_DEPT();</code></pre>

<h4>역할(Role)</h4>
<p>권한 집합을 역할로 묶어 관리. 권한 변경 시 역할만 수정.</p>
<pre><code>CREATE ROLE readonly_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_role;
GRANT readonly_role TO user1, user2;</code></pre>

<h3>추론 공격 (Inference Attack)</h3>
<p>허가된 데이터 조합으로 비허가 정보를 유추하는 공격. 통계 DB·익명화 DB에서 발생.</p>
<ul>
  <li><strong>집계 문제(Aggregation)</strong>: 개별적으로 무해한 데이터를 합쳐 민감 정보 유추. 예: 부서별 평균 급여 + 인원수 → 개인 급여 역산.</li>
  <li><strong>추론(Inference)</strong>: 이미 알고 있는 정보 + 통계로 모르는 정보 추론.</li>
</ul>
<h4>대응 기법</h4>
<table>
  <thead><tr><th>기법</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td><strong>셀 억제(Cell Suppression)</strong></td><td>개인 식별 가능한 통계 결과 숨김</td></tr>
    <tr><td><strong>노이즈 추가</strong></td><td>통계값에 무작위 오차 추가</td></tr>
    <tr><td><strong>쿼리 결과 제한</strong></td><td>최소 셀 크기 이상 집계만 허용</td></tr>
    <tr><td><strong>k-익명성</strong></td><td>최소 k명이 동일 속성값을 가지도록 일반화</td></tr>
    <tr><td><strong>차분 프라이버시</strong></td><td>수학적으로 개인 기여분이 결과에 영향 없도록 보장</td></tr>
  </tbody>
</table>

<h3>DB 암호화</h3>
<table>
  <thead><tr><th>방식</th><th>암·복호화 위치</th><th>장점</th><th>단점</th></tr></thead>
  <tbody>
    <tr><td><strong>API 방식</strong></td><td>응용 프로그램</td><td>DB 서버 부하 없음. DB 변경 없음.</td><td>소스 코드 수정 필요. 키 관리 복잡.</td></tr>
    <tr><td><strong>플러그인 방식</strong></td><td>DB 서버 (외부 모듈)</td><td>소스 코드 수정 최소화.</td><td>DB 성능 영향. 추가 라이선스.</td></tr>
    <tr><td><strong>TDE</strong><br>(Transparent Data Encryption)</td><td>DB 엔진</td><td>응용 프로그램 변경 없음. 파일 레벨 암호화.</td><td>DB 서버 메모리는 평문. SQL Injection 방어 안 됨.</td></tr>
    <tr><td><strong>파일 시스템 암호화</strong></td><td>OS/파일 시스템</td><td>DB 수정 없음.</td><td>DB 레벨 공격 방어 안 됨.</td></tr>
  </tbody>
</table>

<h4>개인정보 암호화 대상 (개인정보 안전조치 기준)</h4>
<ul>
  <li>주민등록번호, 여권번호, 운전면허번호, 외국인등록번호 (고유식별정보): 암호화 <strong>필수</strong></li>
  <li>비밀번호: 일방향 암호화(해시+솔트) <strong>필수</strong></li>
  <li>바이오정보(지문, 홍채 등): 암호화 <strong>필수</strong></li>
  <li>신용카드번호, 계좌번호: 암호화 권고</li>
</ul>

<h3>DB 감사 (Audit)</h3>
<p>DB 접근·변경 내역 로깅. 사후 추적·이상 탐지·컴플라이언스 목적.</p>
<ul>
  <li><strong>감사 대상</strong>: 로그인/로그아웃, DDL 수행, 권한 변경, 대용량 조회, 민감 테이블 접근</li>
  <li><strong>감사 로그 보관</strong>: 개인정보 처리 시스템은 접속 기록 <strong>최소 6개월</strong> 보관 (개인정보보호법)</li>
  <li><strong>DAM (Database Activity Monitoring)</strong>: 실시간 DB 트래픽 모니터링. 이상 쿼리 탐지·차단.</li>
</ul>

<h3>DB 보안 위협 및 대응</h3>
<table>
  <thead><tr><th>위협</th><th>대응</th></tr></thead>
  <tbody>
    <tr><td>SQL Injection</td><td>Prepared Statement, 입력 검증, WAF</td></tr>
    <tr><td>권한 남용 (내부자)</td><td>최소 권한, 직무 분리, DB 감사, DAM</td></tr>
    <tr><td>데이터 도난</td><td>암호화, 데이터 마스킹, DLP</td></tr>
    <tr><td>DB 서버 취약점</td><td>패치 관리, 불필요 기능 비활성화</td></tr>
    <tr><td>백업 데이터 노출</td><td>백업 파일 암호화, 접근 제어</td></tr>
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
    keywords: ['CIA', '기밀성', '무결성', '가용성', '위험', '위협', '취약점', '위험관리', '보안정책', '업무연속성', 'BCP', 'DRP', 'DoS', 'DDoS', 'SYN Flooding', 'RTO', 'RPO', '사회공학'],
    content: `

<h3>정보보안 3대 목표 (CIA Triad)</h3>
<table>
  <thead><tr><th>목표</th><th>설명</th><th>보장 수단</th><th>주요 위협</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>기밀성</strong><br>(Confidentiality)</td>
      <td>인가된 사용자만 정보 접근</td>
      <td>암호화, 접근통제, VPN</td>
      <td>도청, 스니핑, 사회공학</td>
    </tr>
    <tr>
      <td><strong>무결성</strong><br>(Integrity)</td>
      <td>정보의 정확성·완전성 유지</td>
      <td>해시, 디지털 서명, 체크섬</td>
      <td>데이터 변조, MITM, 악성코드</td>
    </tr>
    <tr>
      <td><strong>가용성</strong><br>(Availability)</td>
      <td>인가된 사용자가 필요 시 접근 가능</td>
      <td>이중화, 백업, DDoS 방어</td>
      <td>DoS/DDoS, 랜섬웨어, 자연재해</td>
    </tr>
  </tbody>
</table>

<h4>추가 보안 속성</h4>
<table>
  <thead><tr><th>속성</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td><strong>인증성(Authenticity)</strong></td><td>주체의 신원이 주장한 것과 일치함을 보장</td></tr>
    <tr><td><strong>부인방지(Non-repudiation)</strong></td><td>행위 후 부인 불가. 디지털 서명으로 구현.</td></tr>
    <tr><td><strong>책임추적성(Accountability)</strong></td><td>행위자를 특정하고 추적 가능. 감사 로그.</td></tr>
  </tbody>
</table>

<h3>위험 관리</h3>

<h4>핵심 개념</h4>
<ul>
  <li><strong>자산(Asset)</strong>: 조직이 보호해야 할 가치 있는 것 (데이터, 시스템, 인력, 평판)</li>
  <li><strong>위협(Threat)</strong>: 자산에 해를 끼칠 수 있는 잠재적 원인 (해커, 내부자, 자연재해)</li>
  <li><strong>취약점(Vulnerability)</strong>: 위협이 악용할 수 있는 약점 (미패치, 잘못된 설정, 보안 인식 부족)</li>
  <li><strong>위험(Risk)</strong>: 위협이 취약점을 악용해 자산에 피해를 줄 가능성</li>
  <li><strong>위험 = 자산 가치 × 위협 발생 가능성 × 취약점 심각도</strong></li>
</ul>

<h4>위험 처리 방법 (4가지)</h4>
<table>
  <thead><tr><th>방법</th><th>설명</th><th>예시</th></tr></thead>
  <tbody>
    <tr><td><strong>위험 감소(Mitigation/Reduction)</strong></td><td>보안 통제 적용으로 위험 수준 낮춤</td><td>방화벽 설치, 패치 적용, 교육</td></tr>
    <tr><td><strong>위험 수용(Acceptance)</strong></td><td>비용 대비 수용 가능한 수준으로 판단. 잔류 위험 허용.</td><td>경미한 취약점 방치</td></tr>
    <tr><td><strong>위험 전가(Transfer)</strong></td><td>위험을 제3자에게 이전</td><td>사이버보험, 아웃소싱</td></tr>
    <tr><td><strong>위험 회피(Avoidance)</strong></td><td>위험 원인 활동 자체를 중단</td><td>위험한 서비스 제공 중단</td></tr>
  </tbody>
</table>

<h4>위험 평가 방법</h4>
<ul>
  <li><strong>정량적 분석</strong>: 위험을 금전적 수치로 표현.
    <ul>
      <li>ALE (연간 기대 손실) = SLE × ARO</li>
      <li>SLE (단일 발생 기대 손실) = 자산 가치 × 노출 계수</li>
      <li>ARO (연간 발생 횟수)</li>
    </ul>
  </li>
  <li><strong>정성적 분석</strong>: 위험을 등급(상·중·하)으로 표현. 전문가 판단. 빠르지만 주관적.</li>
</ul>

<h3>보안 통제 분류</h3>
<h4>목적별 분류</h4>
<table>
  <thead><tr><th>유형</th><th>목적</th><th>예시</th></tr></thead>
  <tbody>
    <tr><td><strong>예방(Preventive)</strong></td><td>공격 발생 전 차단</td><td>방화벽, 암호화, 접근통제, 보안 교육</td></tr>
    <tr><td><strong>탐지(Detective)</strong></td><td>공격 발생 중·후 발견</td><td>IDS, 감사 로그, CCTV, 모니터링</td></tr>
    <tr><td><strong>교정(Corrective)</strong></td><td>공격 후 피해 수정</td><td>백업 복구, 패치 적용, 격리</td></tr>
    <tr><td><strong>억제(Deterrent)</strong></td><td>잠재적 공격자 억제</td><td>경고 문구, 처벌 정책, 법적 대응</td></tr>
    <tr><td><strong>복구(Recovery)</strong></td><td>운영 복원</td><td>재해복구계획, BCP, 이중화</td></tr>
    <tr><td><strong>보상(Compensating)</strong></td><td>주 통제 대체</td><td>모니터링 강화(패치 불가 시)</td></tr>
  </tbody>
</table>

<h4>구현 방식별 분류</h4>
<ul>
  <li><strong>관리적 통제</strong>: 정책, 절차, 교육, 감사 (Administrative)</li>
  <li><strong>기술적 통제</strong>: 암호화, 방화벽, IDS, 접근통제 (Technical/Logical)</li>
  <li><strong>물리적 통제</strong>: 자물쇠, CCTV, 경비원, 출입통제 (Physical)</li>
</ul>

<h3>DoS / DDoS 공격</h3>

<h4>주요 DoS 공격 유형</h4>
<table>
  <thead><tr><th>공격</th><th>계층</th><th>원리</th></tr></thead>
  <tbody>
    <tr><td><strong>SYN Flooding</strong></td><td>4계층</td><td>대량의 SYN 패킷 전송. 서버 TCP 연결 큐 고갈. IP Spoofing으로 ACK 없음.</td></tr>
    <tr><td><strong>ICMP Flooding (Ping Flood)</strong></td><td>3계층</td><td>대량 ICMP Echo 요청. 대역폭 소모.</td></tr>
    <tr><td><strong>Smurf</strong></td><td>3계층</td><td>피해자 IP를 출발지로 위조 → 브로드캐스트 ICMP → 모든 호스트 응답 → 피해자에게 집중.</td></tr>
    <tr><td><strong>UDP Flooding</strong></td><td>4계층</td><td>대량 UDP 패킷. 서버가 모든 포트를 ICMP Unreachable로 응답. 대역폭 소모.</td></tr>
    <tr><td><strong>HTTP Flooding</strong></td><td>7계층</td><td>정상 HTTP GET/POST 대량 전송. 서버 자원 소모. 탐지 어려움.</td></tr>
    <tr><td><strong>Slowloris</strong></td><td>7계층</td><td>HTTP 연결을 최대한 오래 유지. 요청 헤더를 매우 천천히 전송. 연결 수 고갈.</td></tr>
    <tr><td><strong>Ping of Death</strong></td><td>3계층</td><td>IP 최대 크기(65535B) 초과 ICMP 패킷. 재조립 시 버퍼 오버플로. (현재 패치됨)</td></tr>
    <tr><td><strong>Teardrop</strong></td><td>3계층</td><td>IP 분할 패킷의 오프셋 조작. 재조립 오류. (현재 패치됨)</td></tr>
    <tr><td><strong>Land Attack</strong></td><td>4계층</td><td>출발지 IP/포트 = 목적지 IP/포트 설정. 무한 루프. (현재 패치됨)</td></tr>
  </tbody>
</table>

<h4>DDoS 대응</h4>
<ul>
  <li><strong>블랙홀 라우팅(Null Route)</strong>: 공격 트래픽 목적지를 null 인터페이스로 라우팅. 피해자도 서비스 불가.</li>
  <li><strong>스크러빙 센터(Scrubbing Center)</strong>: 트래픽을 스크러빙 센터로 우회 → 공격 트래픽 제거 → 정상 트래픽만 전달.</li>
  <li><strong>CDN(Content Delivery Network)</strong>: 분산 서버로 트래픽 분산. 대용량 DDoS 흡수.</li>
  <li><strong>트래픽 필터링</strong>: ACL, uRPF(역경로 포워딩), Rate Limiting.</li>
  <li><strong>ISP 협력</strong>: 업스트림에서 공격 트래픽 차단.</li>
</ul>

<h3>BCP / DRP</h3>
<table>
  <thead><tr><th>구분</th><th>BCP (업무연속성계획)</th><th>DRP (재해복구계획)</th></tr></thead>
  <tbody>
    <tr><td>범위</td><td>전사적 업무 연속성 (IT 포함)</td><td>IT 시스템 복구에 집중</td></tr>
    <tr><td>목표</td><td>핵심 업무 최소한의 수준으로 유지</td><td>IT 인프라 신속 복구</td></tr>
    <tr><td>관계</td><td>BCP가 상위 개념</td><td>BCP의 일부</td></tr>
  </tbody>
</table>

<h4>복구 목표</h4>
<ul>
  <li><strong>RTO (Recovery Time Objective)</strong>: 목표 복구 시간. 재해 발생부터 서비스 재개까지 허용 최대 시간. 짧을수록 비용 증가.</li>
  <li><strong>RPO (Recovery Point Objective)</strong>: 목표 복구 시점. 복구 시 허용 가능한 데이터 손실 범위. RPO=0이면 무손실.</li>
  <li><strong>MTTR (Mean Time To Repair)</strong>: 평균 수리 시간.</li>
  <li><strong>MTBF (Mean Time Between Failures)</strong>: 평균 고장 간격 (가용성 지표).</li>
</ul>

<h4>재해 복구 사이트</h4>
<table>
  <thead><tr><th>유형</th><th>준비 수준</th><th>복구 시간</th><th>비용</th></tr></thead>
  <tbody>
    <tr><td><strong>핫 사이트(Hot Site)</strong></td><td>실시간 데이터 동기화. 즉시 전환 가능.</td><td>수 시간 이내</td><td>매우 높음</td></tr>
    <tr><td><strong>웜 사이트(Warm Site)</strong></td><td>하드웨어 준비. 데이터 주기적 백업. 설정 필요.</td><td>수 일</td><td>중간</td></tr>
    <tr><td><strong>콜드 사이트(Cold Site)</strong></td><td>공간·전력만 준비. 하드웨어·데이터 없음.</td><td>수 주</td><td>낮음</td></tr>
  </tbody>
</table>

<h3>사회공학 (Social Engineering)</h3>
<p>기술적 취약점이 아닌 <strong>사람의 심리를 이용한 공격</strong>. 가장 효과적이고 방어 어려움.</p>
<ul>
  <li><strong>피싱(Phishing)</strong>: 신뢰할 수 있는 기관으로 위장한 이메일/웹사이트로 정보 탈취.</li>
  <li><strong>스피어 피싱(Spear Phishing)</strong>: 특정 대상 맞춤형. 성공률 높음.</li>
  <li><strong>보이스 피싱(Vishing)</strong>: 전화로 개인정보 탈취.</li>
  <li><strong>스미싱(Smishing)</strong>: SMS를 이용한 피싱.</li>
  <li><strong>사칭(Pretexting)</strong>: 가짜 신분·상황을 만들어 신뢰 획득. 예: IT 직원 사칭 패스워드 요구.</li>
  <li><strong>베이팅(Baiting)</strong>: 호기심 자극 (악성 USB 방치 등).</li>
  <li><strong>꼬리 물기(Tailgating)</strong>: 인가된 사람 뒤에서 물리적 접근 제한 구역 무단 진입.</li>
  <li><strong>큐 프로 쿼(Quid Pro Quo)</strong>: 무언가를 줄 테니 정보를 달라는 교환 방식.</li>
</ul>
<p><strong>대응</strong>: 보안 인식 교육, 정책 수립, 이중 확인 절차, 물리 보안 강화.</p>
    `,
  },

  // ===== 정보보안관리및법규 =====
  {
    subject: 'law',
    subjectLabel: '정보보안관리및법규',
    chapter: 'security-law',
    chapterLabel: '정보보호 관련 법규',
    keywords: ['정보통신망법', '개인정보보호법', 'ISMS', 'ISMS-P', '전자서명법', '정보보호산업법', '개인정보', '동의', '파기', '과태료', '개인정보보호위원회', 'GDPR', '고유식별정보', '민감정보', '접속기록'],
    content: `

<h3>주요 법률 체계</h3>
<table>
  <thead><tr><th>법률</th><th>주요 내용</th><th>소관 기관</th></tr></thead>
  <tbody>
    <tr><td><strong>개인정보 보호법</strong></td><td>개인정보 처리 원칙·주체 권리·안전조치 의무. 모든 개인정보처리자 적용.</td><td>개인정보보호위원회</td></tr>
    <tr><td><strong>정보통신망 이용촉진 및 정보보호 등에 관한 법률</strong><br>(정보통신망법)</td><td>정보통신서비스 제공자 의무, 해킹·스팸 규제, 청소년 보호.</td><td>과학기술정보통신부 / 방통위</td></tr>
    <tr><td><strong>정보보호산업의 진흥에 관한 법률</strong></td><td>ISMS 인증 법적 근거. 정보보호 산업 지원.</td><td>과학기술정보통신부</td></tr>
    <tr><td><strong>전자서명법</strong></td><td>전자서명·인증 제도. 2020년 개정으로 공인인증서 독점 폐지.</td><td>과학기술정보통신부</td></tr>
    <tr><td><strong>전자금융거래법</strong></td><td>금융 분야 전자거래 보안 기준. 금융회사 정보보호.</td><td>금융위원회</td></tr>
    <tr><td><strong>신용정보의 이용 및 보호에 관한 법률</strong><br>(신용정보법)</td><td>개인신용정보 보호. 마이데이터 사업 근거.</td><td>금융위원회</td></tr>
    <tr><td><strong>통신비밀보호법</strong></td><td>통신 비밀 보호. 불법 감청 금지.</td><td>법무부 / 방통위</td></tr>
  </tbody>
</table>

<h3>개인정보 보호법 핵심</h3>

<h4>개인정보의 정의</h4>
<p>살아 있는 개인에 관한 정보로서 성명·주민등록번호 등으로 개인을 알아볼 수 있는 정보. <strong>다른 정보와 결합해 알아볼 수 있는 것도 포함.</strong></p>
<ul>
  <li>가명정보: 일부 삭제·대체로 추가 정보 없이 개인 식별 불가하게 처리. 통계·연구 목적 동의 없이 활용 가능.</li>
  <li>익명정보: 모든 개인 정보 제거. 개인정보 보호법 미적용.</li>
</ul>

<h4>개인정보 처리 원칙 (8가지)</h4>
<ol>
  <li>목적 명확화</li>
  <li>최소 수집 (목적에 필요한 최소한)</li>
  <li>목적 범위 내 처리</li>
  <li>처리 방법의 적법성·정당성</li>
  <li>정확성·최신성 보장</li>
  <li>안전한 관리</li>
  <li>비밀 보장</li>
  <li>개인정보 처리 투명성</li>
</ol>

<h4>수집·이용 가능한 경우 (법적 근거)</h4>
<ul>
  <li>정보주체 <strong>동의</strong></li>
  <li>법률 규정 또는 법령 의무 준수</li>
  <li>계약 이행</li>
  <li>명백한 이익·공공기관 업무 수행</li>
  <li><strong>정당한 이익</strong> (개인정보처리자)</li>
</ul>

<h4>민감정보 (별도 동의 필요)</h4>
<p>일반 개인정보보다 더 엄격한 보호. 처리 시 <strong>별도의 명시적 동의</strong> 필요.</p>
<ul>
  <li>사상·신념</li>
  <li>노동조합·정당 가입·탈퇴</li>
  <li>정치적 견해</li>
  <li>건강, 성생활에 관한 정보</li>
  <li>유전정보</li>
  <li>범죄경력 정보</li>
  <li>생체인식정보 (지문, 홍채, 얼굴 등)</li>
</ul>

<h4>고유식별정보 (법령 근거 또는 별도 동의 필요)</h4>
<ul>
  <li>주민등록번호, 여권번호, 운전면허번호, 외국인등록번호</li>
  <li>주민등록번호는 <strong>법적 의무 있는 경우를 제외하고 처리 금지</strong></li>
</ul>

<h4>정보주체 권리</h4>
<table>
  <thead><tr><th>권리</th><th>내용</th></tr></thead>
  <tbody>
    <tr><td><strong>열람권</strong></td><td>자신의 개인정보 처리 여부·내용 확인</td></tr>
    <tr><td><strong>정정·삭제권</strong></td><td>부정확하거나 불필요한 정보 정정·삭제 요청</td></tr>
    <tr><td><strong>처리정지권</strong></td><td>개인정보 처리 일시 정지 요청</td></tr>
    <tr><td><strong>동의 철회권</strong></td><td>제공한 동의 언제든지 철회</td></tr>
    <tr><td><strong>손해배상 청구권</strong></td><td>피해 발생 시 손해배상 청구</td></tr>
  </tbody>
</table>

<h4>개인정보 파기</h4>
<p>보유 목적 달성 또는 보유 기간 경과 시 <strong>지체 없이(5일 이내)</strong> 파기.</p>
<ul>
  <li>전자적 파일: 복구 불가능한 방법으로 삭제 (덮어쓰기, 파쇄, 디가우징)</li>
  <li>출력물: 파쇄 또는 소각</li>
  <li>법령에 의해 보존 필요한 경우: 다른 개인정보와 분리 보관</li>
</ul>

<h3>개인정보 안전조치 기준</h3>
<table>
  <thead><tr><th>안전조치 항목</th><th>주요 내용</th></tr></thead>
  <tbody>
    <tr><td><strong>내부 관리계획</strong></td><td>수립·시행. 개인정보 보호책임자(CPO) 지정.</td></tr>
    <tr><td><strong>접근통제</strong></td><td>권한 있는 자만 접근. 외부 접속 차단 또는 VPN.</td></tr>
    <tr><td><strong>접근권한 관리</strong></td><td>최소 권한 부여. 퇴직자 즉시 권한 회수. 권한 부여 기록 보관.</td></tr>
    <tr><td><strong>암호화</strong></td><td>고유식별정보·비밀번호·바이오정보 암호화 필수. 전송 시 SSL/TLS.</td></tr>
    <tr><td><strong>접속기록 보관</strong></td><td>최소 <strong>6개월</strong> 보관. 5만 명 이상 처리 또는 민감정보 처리 시 <strong>2년</strong>.</td></tr>
    <tr><td><strong>접속기록 위변조 방지</strong></td><td>접속기록의 무결성 보장.</td></tr>
    <tr><td><strong>보안프로그램</strong></td><td>악성프로그램 방지 소프트웨어 설치·운영. 자동 업데이트.</td></tr>
    <tr><td><strong>물리적 안전조치</strong></td><td>출입 통제, 잠금장치, 보안 구역 설정.</td></tr>
  </tbody>
</table>

<h3>ISMS / ISMS-P 인증</h3>

<h4>비교</h4>
<table>
  <thead><tr><th>구분</th><th>ISMS</th><th>ISMS-P</th></tr></thead>
  <tbody>
    <tr><td>인증 범위</td><td>정보보호 관리체계</td><td>정보보호 + 개인정보보호 통합</td></tr>
    <tr><td>인증 기준</td><td>102개 통제항목</td><td>102개 + 개인정보보호 추가 항목</td></tr>
    <tr><td>인증 기관</td><td>KISA (한국인터넷진흥원)</td><td>KISA</td></tr>
    <tr><td>유효 기간</td><td>3년 (매년 사후심사)</td><td>3년 (매년 사후심사)</td></tr>
  </tbody>
</table>

<h4>ISMS 의무 인증 대상</h4>
<ul>
  <li><strong>ISP</strong>: 기간통신사업자 (KT, SKT, LGU+ 등)</li>
  <li><strong>IDC</strong>: 인터넷데이터센터</li>
  <li><strong>정보통신서비스 제공자</strong>: 연간 매출액 100억 원 이상 또는 전년도 말 일일평균 이용자 수 100만 명 이상</li>
  <li><strong>병원</strong>: 전년도 말 일일평균 이용자 수 100만 명 이상</li>
</ul>

<h3>주요 처벌 기준</h3>
<table>
  <thead><tr><th>위반 내용</th><th>처벌</th></tr></thead>
  <tbody>
    <tr><td>개인정보 유출·침해 (개인정보보호법)</td><td>5년 이하 징역 또는 5천만원 이하 벌금</td></tr>
    <tr><td>주민등록번호 암호화 미적용</td><td>과태료 3천만원 이하</td></tr>
    <tr><td>안전조치 의무 위반</td><td>과태료 3천만원 이하</td></tr>
    <tr><td>개인정보 처리방침 미공개</td><td>과태료 1천만원 이하</td></tr>
    <tr><td>해킹 등 침해사고 (정보통신망법)</td><td>5년 이하 징역 또는 5천만원 이하 벌금</td></tr>
    <tr><td>스팸 전송</td><td>3천만원 이하 과태료</td></tr>
  </tbody>
</table>

<h3>침해사고 대응</h3>
<ul>
  <li><strong>침해사고 신고 의무</strong>: 정보통신서비스 제공자는 침해사고 발생 시 <strong>24시간 이내</strong> KISA에 신고.</li>
  <li><strong>개인정보 유출 통지 의무</strong>: 정보주체에게 <strong>72시간 이내</strong> 통지. 1천 명 이상 유출 시 행정안전부·개인정보보호위원회 신고.</li>
  <li><strong>CERT (Computer Emergency Response Team)</strong>: 침해사고 대응 전담 조직.</li>
  <li><strong>KISA 인터넷침해대응센터</strong>: 국가 차원 침해사고 대응.</li>
</ul>

<h3>국제 표준 및 규정</h3>
<ul>
  <li><strong>ISO/IEC 27001</strong>: 정보보호 관리체계 국제 표준. ISMS의 국제판.</li>
  <li><strong>ISO/IEC 27002</strong>: 정보보호 통제 항목 실무 가이드.</li>
  <li><strong>GDPR (EU 일반 데이터 보호 규정)</strong>: EU 시민 개인정보 보호. 위반 시 전 세계 매출의 4% 또는 2천만 유로 중 높은 금액.</li>
  <li><strong>PCI-DSS</strong>: 카드사 공동 결제 보안 기준. 신용카드 정보 처리 시 준수.</li>
  <li><strong>NIST CSF</strong>: 미국 사이버보안 프레임워크. 식별-보호-탐지-대응-복구.</li>
</ul>
    `,
  },
];
