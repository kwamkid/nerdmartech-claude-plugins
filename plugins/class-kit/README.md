<p align="center"><img src="assets/nerdman.png" width="180" alt="nerdman"></p>

# Nerd MarTech Class Kit

ชุดเริ่มต้นสำหรับคอร์ส AI ของ Nerd MarTech — ลงครั้งเดียว ได้ทั้งตัววัดโควตาหลังทุกคำตอบ และ Skill ที่ใช้ตลอดคอร์ส

## ติดตั้ง

เปิด terminal ใน VS Code (เมนู Terminal → New Terminal) แล้วพิมพ์ทีละบรรทัด:

```
claude plugin marketplace add kwamkid/nerdmartech-claude-plugins
claude plugin install class-kit@nerdmartech
```

แล้วกลับไปที่แผง Claude เปิดแชตใหม่ 1 ครั้ง (คำสั่ง `/plugin` ใช้ในแผง VS Code ไม่ได้ ต้องลงผ่าน terminal) · ต้องมี Node.js ในเครื่อง (เช็กได้ด้วย `/check-machine`)

## ได้อะไรบ้าง

**ตัววัดหลังทุกคำตอบ** — หลัง Claude ตอบเสร็จจะขึ้นบรรทัดสั้นๆ เช่น

```
แชตนี้ยาว 25% 🟢 · โควตา 5 ชม. ใช้ไป 40% 🟢 (รีเซ็ต 14:30) · สัปดาห์นี้ 12%
```

ขึ้น 🔴 เมื่อไร = แชตยาวแล้ว ให้สรุปงานแล้วเปิดแชตใหม่ (`/memo` → `/clear`)

| พิมพ์ | ใช้เมื่อ |
|---|---|
| `/memo` | จบเรื่อง หรือแชตยาวแล้ว → จดสิ่งที่ทำลง `memo/NOTES.md` งานค้างลง `memo/TODO.md` |
| `/todo` | เปิดแชตใหม่แล้วอยากทำงานค้างต่อ |
| `/new-project` | เริ่มโปรเจกต์ใหม่เอง: โฟลเดอร์ + CLAUDE.md → GitHub → Vercel (→ Supabase) ทีละขั้น |
| `/setup-folders` | สร้างโฟลเดอร์บริษัท + สารบัญ CLAUDE.md + กฎตั้งต้น 7 ข้อ |
| `/check-machine` | เช็กว่าเครื่องมี Git · Node · npm ครบไหม |
| `/fix-error` | เจอ error → แปะข้อความหรือรูปแคปจอ ให้อธิบายและแก้ |
| `/ship` | เอาเว็บขึ้นออนไลน์ (GitHub → Vercel) แล้วส่งลิงก์ให้กด |
| `/mobile-check` | เช็กหน้าเว็บบนจอมือถือว่าล้นจอไหม |
| `/project-post` | เขียนโพสต์ตามแบรนด์และข้อมูลจริงของบริษัท |
| `/project-image` | สร้างภาพประกอบด้วย Higgsfield ในสไตล์เดียวกันทุกครั้ง |

**หลักจำ: 1 เรื่อง = 1 แชต · จบเรื่องแล้ว `/memo` → `/clear`**

## เรื่องโควตา

ตัวเลขโควตาดึงจากเซิร์ฟเวอร์ชุดเดียวกับหน้า https://claude.ai/settings/usage โดยใช้การล็อกอินของ Claude Code ในเครื่อง (ส่งไปที่ api.anthropic.com เท่านั้น) · ถ้าดึงไม่ได้ จะแสดงแค่ความยาวแชต — ดูโควตาที่หน้า Usage แทน
