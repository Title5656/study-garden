/* Course data for Study Garden shared flashcards, quiz and progress. */
window.StudyContent = window.StudyContent || {};
window.StudyContent["thermo-chemical"] = {
  "01": {
    "cards": [
      [
        "System",
        "ส่วนที่เราเลือกศึกษา มีขอบเขตกำหนดชัด"
      ],
      [
        "Surroundings",
        "ทุกอย่างนอกระบบ"
      ],
      [
        "Open/Closed/Isolated",
        "มวลผ่านได้ / มวลผ่านไม่ได้ / ทั้งมวลและพลังงานผ่านไม่ได้"
      ],
      [
        "Intensive",
        "สมบัติไม่ขึ้นกับขนาดระบบ เช่น T, P"
      ],
      [
        "Extensive",
        "สมบัติขึ้นกับปริมาณ เช่น U, V, S"
      ],
      [
        "State function",
        "ค่าขึ้นกับสถานะต้นและปลาย"
      ],
      [
        "Path function",
        "ค่าขึ้นกับเส้นทาง เช่น Q, W"
      ],
      [
        "Enthalpy H",
        "U + PV เป็นสมบัติสะดวกสำหรับระบบไหล"
      ],
      [
        "Adiabatic",
        "ไม่มีความร้อนผ่านขอบเขต Q=0"
      ],
      [
        "Quasistatic",
        "ช้ามากจนระบบใกล้สมดุลระหว่างทาง ไม่ได้แปลว่า reversible โดยอัตโนมัติ"
      ]
    ],
    "quiz": [
      {
        "q": "ถังแข็งปิดสนิทรับความร้อนจากภายนอกเป็นระบบชนิดใด?",
        "options": [
          "ระบบเปิด",
          "ระบบปิด",
          "ระบบโดดเดี่ยว",
          "ไม่ถือเป็นระบบ"
        ],
        "answer": 1,
        "explanation": "มวลไม่ผ่าน แต่พลังงานผ่านเป็นความร้อนได้"
      },
      {
        "q": "สมบัติใดเป็น intensive?",
        "options": [
          "มวล m",
          "ปริมาตร V",
          "ความดัน P",
          "พลังงาน U"
        ],
        "answer": 2,
        "explanation": "P ไม่เพิ่มเมื่อจำลองระบบสองเท่าที่สภาวะเหมือนเดิม"
      },
      {
        "q": "ระบบปิดรับ Q=80 kJ และทำงานออก 30 kJ จะได้ ΔU เท่าไร?",
        "options": [
          "+110 kJ",
          "−50 kJ",
          "−110 kJ",
          "+50 kJ"
        ],
        "answer": 3,
        "explanation": "ใช้ ΔU = Q − Wout = 80 − 30"
      },
      {
        "q": "ข้อใดเป็น Path function?",
        "options": [
          "งาน W",
          "เอนทัลปี H",
          "พลังงานภายใน U",
          "เอนโทรปี S"
        ],
        "answer": 0,
        "explanation": "งานขึ้นกับเส้นทางกระบวนการ"
      },
      {
        "q": "อุณหภูมิ 25°C เท่ากับเท่าไร?",
        "options": [
          "248.15 K",
          "298.15 K",
          "25 K",
          "273.15 K"
        ],
        "answer": 1,
        "explanation": "อุณหภูมิสัมบูรณ์เท่ากับองศาเซลเซียสบวก 273.15"
      },
      {
        "q": "ก๊าซอุดมคติ 1 โมลใช้สมการใดเชื่อม P,V,T?",
        "options": [
          "PV = nR/T",
          "P = RT/V²",
          "PV = RT",
          "P = V/RT"
        ],
        "answer": 2,
        "explanation": "สมการอุดมคติ PV = nRT, n=1"
      },
      {
        "q": "กระบวนการ adiabatic หมายความว่าอย่างไร?",
        "options": [
          "T คงที่",
          "S คงที่เสมอ",
          "P คงที่",
          "Q = 0"
        ],
        "answer": 3,
        "explanation": "adiabatic ไม่มีการถ่ายเทความร้อน แต่ entropy อาจเพิ่มหาก irreversible"
      },
      {
        "q": "กรณีระบบปิดมีเฉพาะงาน P–V แบบ quasistatic และ V คงที่ Wout เท่าใด?",
        "options": [
          "0",
          "P/V",
          "PV",
          "ΔH"
        ],
        "answer": 0,
        "explanation": "เพราะ dV=0 ดังนั้น ∫P dV=0"
      },
      {
        "q": "ข้อใดกล่าวถูกเกี่ยวกับ H?",
        "options": [
          "H = Q + W",
          "H = U + PV",
          "H = U − PV",
          "H = PV/U"
        ],
        "answer": 1,
        "explanation": "เอนทัลปีนิยามว่า H=U+PV ซึ่งรวมพลังงานภายในและเทอมความดันคูณปริมาตร"
      },
      {
        "q": "สิ่งใดเป็นข้อสรุปจากกฎข้อที่สอง?",
        "options": [
          "พลังงานหายไปได้",
          "อุณหภูมิติดลบ K ได้ตามปกติ",
          "ความร้อนไม่ไหลจากเย็นไปร้อนเองโดยไม่มีผลอื่น",
          "ปริมาตรของก๊าซคงที่เสมอ"
        ],
        "answer": 2,
        "explanation": "การแปลงพลังงานมีทิศทางและขีดจำกัด"
      }
    ]
  },
  "02": {
    "cards": [
      [
        "First law",
        "พลังงานสะสม = เข้า − ออก"
      ],
      [
        "ΔU",
        "การเปลี่ยนพลังงานภายใน; สำหรับระบบปิด ΔU=Q−Wout เมื่อ ΔKE=ΔPE=0"
      ],
      [
        "Enthalpy",
        "H=U+PV รวม flow work"
      ],
      [
        "Control volume",
        "ขอบเขตอ้างอิงระบบไหล"
      ],
      [
        "ṁ",
        "อัตราการไหลมวล kg/s"
      ],
      [
        "Steady state",
        "สมบัติและปริมาณสะสมของ CV ไม่เปลี่ยนตามเวลา"
      ],
      [
        "Unsteady",
        "ต้องรวมพจน์สะสมตามเวลา"
      ],
      [
        "Cv",
        "(∂U/∂T)ᵥ"
      ],
      [
        "Cp",
        "(∂H/∂T)ₚ"
      ],
      [
        "Phase rule",
        "F=C−Pphase+2 สำหรับระบบไม่เกิดปฏิกิริยา"
      ]
    ],
    "quiz": [
      {
        "q": "ระบบปิดได้รับ Q=100 J และทำงานออก 40 J มี ΔU เท่าใด?",
        "options": [
          "140 J",
          "−60 J",
          "60 J",
          "100 J"
        ],
        "answer": 2,
        "explanation": "กฎข้อที่หนึ่งสำหรับระบบปิด ΔU=Q−Wout=100−40=60 J"
      },
      {
        "q": "เส้นทางใหม่มี ΔU เดิม=60 J แต่ทำงานออก 20 J ต้องมี Q?",
        "options": [
          "40 J",
          "60 J",
          "−80 J",
          "80 J"
        ],
        "answer": 3,
        "explanation": "จัดรูปจาก ΔU=Q−Wout จะได้ Q=ΔU+Wout=60+20=80 J"
      },
      {
        "q": "ในสมการพลังงานไหล h ประกอบจากอะไร?",
        "options": [
          "u+Pv",
          "u−Pv",
          "Pv/u",
          "Cp+Cv"
        ],
        "answer": 0,
        "explanation": "Flow work ถูกนับรวมใน enthalpy"
      },
      {
        "q": "ระบบ steady state มีมวลสะสมใน CV ต่อเวลาเท่าไร?",
        "options": [
          "เท่ากับ Q̇",
          "ศูนย์",
          "เท่ากับ Ẇ",
          "มากกว่า 0 เสมอ"
        ],
        "answer": 1,
        "explanation": "นิยาม steady state คือปริมาณสะสมไม่เปลี่ยนตามเวลา"
      },
      {
        "q": "Ideal gas เปลี่ยน P แต่ T เท่าเดิม ΔH มีค่าเท่าไร?",
        "options": [
          "เท่ากับ ΔP",
          "เท่ากับ PΔV",
          "0",
          "หาไม่ได้ทุกกรณี"
        ],
        "answer": 2,
        "explanation": "H ของ ideal gas ขึ้นกับ T เท่านั้น"
      },
      {
        "q": "เครื่องหัวฉีดเร่งลมจาก 0 เป็น 600 m/s มี ΔKE/m เท่าไร?",
        "options": [
          "180 J/kg",
          "600 kJ/kg",
          "360 kJ/kg",
          "180 kJ/kg"
        ],
        "answer": 3,
        "explanation": "½(600²)=180000 J/kg = 180 kJ/kg"
      },
      {
        "q": "ที่ปริมาตรคงที่และมีเพียงงาน P–V ค่า Q สำหรับระบบปิดเท่ากับอะไร?",
        "options": [
          "ΔU",
          "ΔH",
          "−ΔU",
          "0"
        ],
        "answer": 0,
        "explanation": "Wout=0 จาก dV=0 จึง ΔU=Q"
      },
      {
        "q": "Cp − Cv ของก๊าซอุดมคติต่อโมลคืออะไร?",
        "options": [
          "0",
          "R",
          "PV",
          "T"
        ],
        "answer": 1,
        "explanation": "ก๊าซอุดมคติมี Mayer relation Cp−Cv=R"
      },
      {
        "q": "สมการใดสำหรับ unsteady open CV ไม่ควรตัดทิ้ง?",
        "options": [
          "ทุกพจน์ Q̇",
          "ทุกพจน์ h",
          "dECV/dt",
          "ทุกพจน์ Ẇ"
        ],
        "answer": 2,
        "explanation": "ระบบไม่คงตัวมีการสะสมพลังงาน"
      },
      {
        "q": "การพาความร้อนในท่อที่มีความเร็วปลายสูงควรตรวจพจน์ใด?",
        "options": [
          "Δ(mg)",
          "ΔZ compressibility เท่านั้น",
          "Δμ ทางเคมีเท่านั้น",
          "Δ(c²/2)"
        ],
        "answer": 3,
        "explanation": "พลังงานจลน์อาจมีขนาดใกล้กับ enthalpy"
      }
    ]
  },
  "03": {
    "cards": [
      [
        "Saturation",
        "สภาวะที่ของเหลวและไอสมดุลกัน"
      ],
      [
        "Triple point",
        "จุดสามเฟสอยู่ร่วมสมดุล"
      ],
      [
        "Critical point",
        "จุดปลายขอบเขต liquid-vapor"
      ],
      [
        "Isotherm",
        "เส้นอุณหภูมิคงที่บนกราฟ"
      ],
      [
        "Z factor",
        "Z=PṼ/(RT) บอกความเบี่ยงเบนจาก ideal gas"
      ],
      [
        "Virial",
        "สมการสถานะรูปอนุกรมเพื่อประมาณก๊าซจริง"
      ],
      [
        "Van der Waals",
        "EoS ที่มีพจน์ a และ b แทนผลโมเลกุล"
      ],
      [
        "Reduced properties",
        "Tr=T/Tc, Pr=P/Pc"
      ],
      [
        "Acentric factor",
        "ω เพิ่มผลความแตกต่างระหว่างโมเลกุลในการประมาณ corresponding states"
      ],
      [
        "Rackett",
        "ความสัมพันธ์สำหรับประมาณปริมาตรของเหลวอิ่มตัว"
      ]
    ],
    "quiz": [
      {
        "q": "สมการก๊าซอุดมคติ 1 mol คืออะไร?",
        "options": [
          "PṼ=R/T",
          "P=RTṼ",
          "Z=0",
          "PṼ=RT"
        ],
        "answer": 3,
        "explanation": "ปริมาตรต่อโมลคูณ P เท่ากับ RT"
      },
      {
        "q": "ถ้า Z = 1 ก๊าซมีพฤติกรรมเทียบเท่าอะไรในนิยาม?",
        "options": [
          "Ideal gas",
          "อิ่มตัวเสมอ",
          "ของแข็ง",
          "ของเหลวบริสุทธิ์เสมอ"
        ],
        "answer": 0,
        "explanation": "นิยาม Z = PṼ/RT จึงเท่ากับ 1 เมื่อ PV สอดคล้อง ideal"
      },
      {
        "q": "Tr นิยามอย่างไร?",
        "options": [
          "Tc/T",
          "T/Tc",
          "P/Pc",
          "T−Tc"
        ],
        "answer": 1,
        "explanation": "Reduced T คืออุณหภูมิสัมบูรณ์หาร critical T"
      },
      {
        "q": "ในสมการ Van der Waals ค่า b ใช้สะท้อนอะไร?",
        "options": [
          "ค่าความร้อนแฝง",
          "ความเร็วเสียง",
          "ขนาดหรือปริมาตรยกเว้นของโมเลกุล",
          "จำนวนเฟส"
        ],
        "answer": 2,
        "explanation": "b ปรับปริมาตรที่โมเลกุลเข้าถึงได้"
      },
      {
        "q": "Virial coefficient B โดยทั่วไปขึ้นกับอะไร?",
        "options": [
          "จำนวนโมลอย่างเดียว",
          "พื้นที่ลูกสูบอย่างเดียว",
          "ขึ้นกับเลขหน้า PDF",
          "ชนิดสารและอุณหภูมิ"
        ],
        "answer": 3,
        "explanation": "B เป็นสมบัติการปฏิสัมพันธ์ของก๊าซที่ขึ้นกับ T"
      },
      {
        "q": "ในบริเวณ 2 เฟส สมการ cubic อาจมีรากปริมาตรกี่ค่าจริง?",
        "options": [
          "มากกว่าหนึ่ง",
          "เป็นหนึ่งค่าบวกเสมอ",
          "ไม่มีรากได้เลยทุกครั้ง",
          "มีค่าเป็นศูนย์อย่างเดียว"
        ],
        "answer": 0,
        "explanation": "สามารถมีสามรากจริง โดยต้องพิจารณาความเสถียรของเฟส"
      },
      {
        "q": "ที่ T ต่ำกว่า critical และ P ตามเส้น saturation ของสารบริสุทธิ์อาจพบอะไร?",
        "options": [
          "มีแต่ plasma",
          "ของเหลวและไออยู่ร่วมกัน",
          "ความดันเป็นศูนย์",
          "ได้แค่ของแข็ง"
        ],
        "answer": 1,
        "explanation": "บนเส้น liquid-vapor saturation สองเฟสอาจอยู่ร่วมสมดุล"
      },
      {
        "q": "เมื่อใช้ P,T กำหนดชนิดเฟส สิ่งใดถูกต้อง?",
        "options": [
          "T สูงแปลว่าไอเสมอ",
          "P สูงแปลว่าของแข็งเสมอ",
          "ต้องเทียบกับกรอบสมดุลเฟส",
          "Z เท่ากับ 0 เสมอ"
        ],
        "answer": 2,
        "explanation": "ต้องดู P และ T ร่วมกันเทียบจุดเดือด/เส้นอิ่มตัว"
      },
      {
        "q": "ค่าที่เพิ่มใน Pitzer correlation คืออะไร?",
        "options": [
          "งาน W",
          "มวล m",
          "enthalpy H",
          "Acentric factor ω"
        ],
        "answer": 3,
        "explanation": "Pitzer ใช้ ω เพิ่มรายละเอียดความต่างของสาร"
      },
      {
        "q": "สำหรับของเหลวอิ่มตัวควรเลือกข้อมูลใด?",
        "options": [
          "Saturated-liquid property หรือ correlation ที่เหมาะ",
          "สมการก๊าซอุดมคติอย่างเดียวเสมอ",
          "Z=1 เสมอ",
          "ความเร็วหัวฉีด"
        ],
        "answer": 0,
        "explanation": "ปริมาตรของเหลวไม่ควรประมาณจาก ideal gas โดยตรง"
      }
    ]
  },
  "04": {
    "cards": [
      [
        "Sensible heat",
        "พลังงานที่เปลี่ยน T โดยไม่เปลี่ยนเฟส/ปฏิกิริยา"
      ],
      [
        "Latent heat",
        "พลังงานที่สัมพันธ์กับการเปลี่ยนเฟส"
      ],
      [
        "Cp(T)",
        "ความจุความร้อนที่ขึ้นกับ T"
      ],
      [
        "ΔHf°",
        "เอนทัลปีการเกิดสาร 1 mol จากธาตุมาตรฐาน"
      ],
      [
        "ΔHc°",
        "เอนทัลปีการเผาไหม้ตามผลิตภัณฑ์/สถานะที่กำหนด"
      ],
      [
        "Hess’s law",
        "เอนทัลปีรวมไม่ขึ้นกับเส้นทาง"
      ],
      [
        "Kirchhoff’s law",
        "ปรับ ΔHr จากอุณหภูมิอ้างอิงด้วย ∫ΔCp dT"
      ],
      [
        "Trouton",
        "กฎเชิงประสบการณ์ประมาณ ΔSvap ที่ Tb"
      ],
      [
        "Watson",
        "ประมาณ ΔHvap ต่างอุณหภูมิด้วย Tr"
      ],
      [
        "Adiabatic flame T",
        "อุณหภูมิที่ energy balance หาค่าเมื่อ reactor ไม่เสีย/รับความร้อน"
      ]
    ],
    "quiz": [
      {
        "q": "Sensible heat โดยทั่วไปสัมพันธ์กับอะไร?",
        "options": [
          "การเปลี่ยน T โดยไม่เกิด phase change",
          "การเปลี่ยนสถานะโดย T คงที่อย่างเดียว",
          "แค่การเปลี่ยนจำนวนโมลจากปฏิกิริยา",
          "พลังงานจลน์เท่านั้น"
        ],
        "answer": 0,
        "explanation": "Sensible heat คือส่วนปรับอุณหภูมิ"
      },
      {
        "q": "ก๊าซ ideal Cp(T) เปลี่ยนตาม T ต้องหา ΔH อย่างไร?",
        "options": [
          "ใช้ Cp=0",
          "อินทิเกรต Cp(T) จาก T₁ ถึง T₂",
          "ใช้ H=PV เสมอ",
          "ใช้ T₂−T₁ โดยไม่คูณอะไร"
        ],
        "answer": 1,
        "explanation": "เมื่อ Cp เปลี่ยนตาม T ต้องอินทิเกรต ΔH=∫Cp(T)dT ตามช่วงอุณหภูมิ"
      },
      {
        "q": "ค่าความร้อนแฝงการระเหยใกล้ Tc แนวโน้มเป็นอย่างไร?",
        "options": [
          "เพิ่มไม่จำกัด",
          "คงที่เสมอ",
          "ลดลงจนเป็นศูนย์ที่จุดวิกฤต",
          "เป็นค่าลบเสมอ"
        ],
        "answer": 2,
        "explanation": "ความแตกต่างระหว่างเฟส liquid/vapor ลดลงเมื่อใกล้ Tc"
      },
      {
        "q": "ΔHf° ของ O₂(g) มาตรฐานเท่าไร?",
        "options": [
          "1 kJ/mol",
          "−100 kJ/mol",
          "ขึ้นกับปริมาตรเท่านั้น",
          "0"
        ],
        "answer": 3,
        "explanation": "ธาตุในรูปมาตรฐานถูกกำหนดเอนทัลปีการเกิดเป็นศูนย์"
      },
      {
        "q": "สูตร ΔHr° จาก ΔHf° คืออะไร?",
        "options": [
          "Σν ΔHf° โดยผลิตภัณฑ์บวก",
          "Σm Cp",
          "ΣP V",
          "Q/W"
        ],
        "answer": 0,
        "explanation": "ใช้สโตอิชิโอเมทรีและค่าการเกิดของผลิตภัณฑ์และสารตั้งต้น"
      },
      {
        "q": "ถ้า ΔHr°298 ต้องการคำนวณที่ 800°C ควรใช้อะไร?",
        "options": [
          "แทนค่าเดิมโดยไม่ตรวจ",
          "Kirchhoff’s law และ ΔCp",
          "สมการ Z=1 อย่างเดียว",
          "P=F/A"
        ],
        "answer": 1,
        "explanation": "ΔHr เปลี่ยนกับอุณหภูมิตามความต่าง Cp"
      },
      {
        "q": "Methane 1 mol ต้องการ O₂ ตามสโตอิชิโอเมทรีกี่ mol เพื่อ CO₂+H₂O?",
        "options": [
          "1 mol",
          "0.5 mol",
          "2 mol",
          "4 mol"
        ],
        "answer": 2,
        "explanation": "ดุลสมการเผาไหม้สมบูรณ์ CH₄+2O₂→CO₂+2H₂O จึงใช้ O₂ 2 mol ต่อ methane 1 mol"
      },
      {
        "q": "Methane ใช้ 20% excess air ต้องมี O₂ ป้อนเท่าไรต่อ CH₄ 1 mol?",
        "options": [
          "2 mol",
          "0.4 mol",
          "1.2 mol",
          "2.4 mol"
        ],
        "answer": 3,
        "explanation": "ปริมาณเชิงทฤษฎี O₂=2 mol; ป้อนเพิ่ม 20% คือ 2×1.20=2.4 mol"
      },
      {
        "q": "ปฏิกิริยาเกิดหลายขั้น ใช้กฎใดบอกว่า ΔH รวมไม่ขึ้นกับเส้นทาง?",
        "options": [
          "Hess’s law",
          "Boyle’s law",
          "Zeroth law อย่างเดียว",
          "Newton’s second law"
        ],
        "answer": 0,
        "explanation": "เอนทัลปีเป็นสมบัติสถานะ"
      },
      {
        "q": "ค่า HHV เทียบ LHV ต่างจากสมมติฐานใดเป็นหลักสำหรับเชื้อเพลิงมี H?",
        "options": [
          "ความเร็วของหัวฉีด",
          "การควบแน่นของน้ำผลิตภัณฑ์",
          "แรงดันไฟฟ้า",
          "จำนวนสูบ"
        ],
        "answer": 1,
        "explanation": "HHV รวมความร้อนจากการควบแน่นของน้ำตามนิยาม"
      }
    ]
  },
  "05": {
    "cards": [
      [
        "Kelvin–Planck",
        "ห้ามเครื่องยนต์วัฏจักรรับความร้อนจากแหล่งเดียวแล้วแปลงเป็นงานทั้งหมด"
      ],
      [
        "Clausius",
        "ความร้อนไม่ไหลจากเย็นไปร้อนเองโดยไม่มีผลอื่น"
      ],
      [
        "Carnot",
        "วงจร reversible ที่ให้ประสิทธิภาพสูงสุดระหว่างสอง reservoir"
      ],
      [
        "Thermal efficiency",
        "η=Wnet/QH"
      ],
      [
        "Entropy",
        "S เป็นสมบัติสถานะที่ใช้ทดสอบทิศทาง/irreversibility"
      ],
      [
        "Entropy generation",
        "Sgen≥0, =0 เมื่อ reversible ทั้งหมด"
      ],
      [
        "Clausius inequality",
        "∮δQ/T≤0 สำหรับวงจร (ข้อจำกัดสถานะของ T บริเวณถ่ายเท)"
      ],
      [
        "Exergy",
        "ศักยภาพงานอ้างสิ่งแวดล้อม"
      ],
      [
        "Lost work",
        "T₀Sgen จาก irreversibility"
      ],
      [
        "Third law",
        "ผลึกสมบูรณ์ที่ 0 K มี S=0 ตามสมมติฐาน"
      ]
    ],
    "quiz": [
      {
        "q": "Carnot efficiency ใช้ T หน่วยใด?",
        "options": [
          "Celsius",
          "Kelvin",
          "Fahrenheit โดยไม่แปลง",
          "หน่วยใดก็ได้"
        ],
        "answer": 1,
        "explanation": "อัตราส่วน T ต้องเป็น absolute thermodynamic temperature"
      },
      {
        "q": "TH=600 K, TC=300 K ηCarnot เท่าไร?",
        "options": [
          "100%",
          "25%",
          "50%",
          "75%"
        ],
        "answer": 2,
        "explanation": "ประสิทธิภาพสูงสุด Carnot η=1−TC/TH=1−300/600=0.5 หรือ 50%"
      },
      {
        "q": "Entropy generation ของกระบวนการจริงที่เป็นไปได้ต้องเป็นอย่างไร?",
        "options": [
          "Sgen < 0 เสมอ",
          "Sgen = −∞",
          "เท่ากับ Q เสมอ",
          "Sgen ≥ 0"
        ],
        "answer": 3,
        "explanation": "กฎข้อสองกำหนดไม่ให้ entropy generation ติดลบ"
      },
      {
        "q": "เครื่องยนต์ทำงานเป็นวัฏจักรมี ΔUcycle เท่าไร?",
        "options": [
          "0",
          "เท่ากับ QH",
          "เท่ากับ QC",
          "เท่ากับ Wnet เสมอ"
        ],
        "answer": 0,
        "explanation": "กลับสู่สถานะเดิมจึง ΔU=0"
      },
      {
        "q": "ในระบบปิดสำหรับเส้นทาง reversible นิยาม dS คืออะไร?",
        "options": [
          "δW/T",
          "δQrev/T",
          "Q/T²",
          "PV"
        ],
        "answer": 1,
        "explanation": "เป็นนิยามสมบัติ entropy"
      },
      {
        "q": "TH > TC ส่ง Q จากร้อนไปเย็น ΔStotal ของ reservoir เป็นอย่างไร?",
        "options": [
          "ลบ",
          "ศูนย์ทุกกรณี",
          "บวก",
          "ไม่เกี่ยวกับ T"
        ],
        "answer": 2,
        "explanation": "−Q/TH+Q/TC เป็นบวกเมื่อ TC<TH"
      },
      {
        "q": "ใน ideal gas Cp คงที่สูตร Δs(T,P) คืออะไร?",
        "options": [
          "Cp(T₂−T₁)",
          "P₂−P₁",
          "T₂P₂",
          "Cp ln(T₂/T₁) − R ln(P₂/P₁)"
        ],
        "answer": 3,
        "explanation": "สมบัติ entropy ideal gas ได้จาก dS=Cp dT/T−R dP/P"
      },
      {
        "q": "การสูญเสีย Exergy จาก irreversibility เท่ากับอะไร?",
        "options": [
          "T₀ Sgen",
          "T₀/Sgen",
          "Q−P",
          "P/T₀"
        ],
        "answer": 0,
        "explanation": "Gouy–Stodola relation"
      },
      {
        "q": "ถ้าเครื่องยนต์จริง η สูงกว่า ηCarnot ที่ TH,TC เดียวกัน หมายถึงอะไร?",
        "options": [
          "เป็นปกติ",
          "ละเมิดกฎข้อสอง/สมมติฐานผิด",
          "แปลว่าแรงเสียดทานเป็นศูนย์",
          "เกิดในเครื่องยนต์ทุกเครื่อง"
        ],
        "answer": 1,
        "explanation": "Carnot เป็นขีดจำกัดบน"
      },
      {
        "q": "กฎข้อสามใช้กำหนดอะไร?",
        "options": [
          "ความเร็วคงที่",
          "Cp=0 ทุก T",
          "จุดอ้างอิง absolute entropy ของผลึกสมบูรณ์ที่ 0 K",
          "η=100%"
        ],
        "answer": 2,
        "explanation": "ผลึกสมบูรณ์ที่ 0 K มี S=0 ใน idealization"
      }
    ]
  },
  "06": {
    "cards": [
      [
        "Helmholtz F",
        "Helmholtz free energy นิยามจากพลังงานภายใน U และเอนโทรปี S คือ F=U−TS"
      ],
      [
        "Gibbs G",
        "G=H−TS และ dG=VdP−SdT"
      ],
      [
        "Maxwell relation",
        "ความสัมพันธ์อนุพันธ์ข้ามจาก potentials"
      ],
      [
        "Residual property",
        "ค่าจริงลบค่า ideal gas ที่ T,P เดียวกัน"
      ],
      [
        "Departure Hᴿ",
        "ส่วนแก้ไข enthalpy ก๊าซจริง"
      ],
      [
        "Clapeyron",
        "dPsat/dT=Δh/(TΔv)"
      ],
      [
        "Clausius–Clapeyron",
        "ประมาณ vapor-pressure slope โดยถือไอ ideal และ ΔHvap คงที่"
      ],
      [
        "Quality x",
        "สัดส่วนมวลไอในของผสมสองเฟส"
      ],
      [
        "Steam table",
        "ตาราง P,T,v,h,u,s แยกเฟส"
      ],
      [
        "Mollier chart",
        "แผนภาพ h–s ใช้วิเคราะห์กระบวนการไอน้ำ"
      ]
    ],
    "quiz": [
      {
        "q": "Gibbs energy G นิยามอย่างไร?",
        "options": [
          "U+TS",
          "PV−H",
          "H−TS",
          "T/S"
        ],
        "answer": 2,
        "explanation": "Gibbs free energy นิยามจากเอนทัลปี H และเอนโทรปี S คือ G=H−TS"
      },
      {
        "q": "Helmholtz energy F คืออะไร?",
        "options": [
          "H+PV",
          "U+TS",
          "P/V",
          "U−TS"
        ],
        "answer": 3,
        "explanation": "Helmholtz free energy นิยามจากพลังงานภายใน U และเอนโทรปี S คือ F=U−TS"
      },
      {
        "q": "Residual property คืออะไร?",
        "options": [
          "Mreal−Mideal ที่ T,P เดียวกัน",
          "Mreal+Mideal",
          "Mreal/Mideal ทุกกรณี",
          "∆T∆P"
        ],
        "answer": 0,
        "explanation": "เป็นส่วนเบี่ยงเบนของของไหลจริง"
      },
      {
        "q": "Clapeyron equation เชื่อมอะไร?",
        "options": [
          "สมการแรงกับระยะทาง",
          "slope ของเส้นสมดุลเฟสกับ Δh/(TΔv)",
          "ความเร็วกับพื้นที่",
          "ความต้านทานไฟฟ้า"
        ],
        "answer": 1,
        "explanation": "มาจาก dG ของเฟสที่สมดุล"
      },
      {
        "q": "Quality x=0.25 แปลว่าอะไร?",
        "options": [
          "ของเหลว 25% เสมอ",
          "อุณหภูมิ 25°C",
          "ไอ 25% ของมวลรวมในระบบสองเฟส",
          "มีไอเพียง 0.25 mol เสมอ"
        ],
        "answer": 2,
        "explanation": "Quality x=mvapor/(mvapor+mliquid) ดังนั้น x=0.25 หมายถึงมีมวลไอ 25%"
      },
      {
        "q": "สำหรับ saturated mixture h คำนวณอย่างไร?",
        "options": [
          "hf+hg",
          "x/hf",
          "hf−hg",
          "hf+x(hg−hf)"
        ],
        "answer": 3,
        "explanation": "เฉลี่ยสมบัติ extensive ต่อมวลของเฟส"
      },
      {
        "q": "กรณี reversible adiabatic nozzle เงื่อนไข s ที่ใช้คืออะไร?",
        "options": [
          "s₂=s₁",
          "s₂=0 เสมอ",
          "s₂=2s₁",
          "ไม่มี entropy ใน nozzle"
        ],
        "answer": 0,
        "explanation": "isentropic idealization"
      },
      {
        "q": "ค่า G ของสองเฟสของ pure substance ในสมดุลเป็นอย่างไร?",
        "options": [
          "molar Gibbs เป็นศูนย์เสมอ",
          "molar Gibbs เท่ากัน",
          "molar Gibbs ต้องตรงข้ามเครื่องหมาย",
          "G นับเป็น mass fraction"
        ],
        "answer": 1,
        "explanation": "equal chemical potential / molar Gibbs equilibrium"
      },
      {
        "q": "จาก dG=VdP−SdT ค่า (∂G/∂P)T เท่าไร?",
        "options": [
          "S",
          "T",
          "V",
          "−V"
        ],
        "answer": 2,
        "explanation": "partial derivative ที่ T คงที่เป็น V"
      },
      {
        "q": "Pseudo-critical linear mixing rules เหมาะกับอะไร?",
        "options": [
          "แทน VLE อย่างแม่นยำทุกคู่สาร",
          "ของเหลวสองเฟสได้แม่น 100%",
          "ใช้โดยไม่ต้องรู้ yi",
          "การประมาณเบื้องต้นภายใต้สมมติฐาน"
        ],
        "answer": 3,
        "explanation": "linear rules ไม่ครอบคลุมปฏิสัมพันธ์ซับซ้อน"
      }
    ]
  },
  "07": {
    "cards": [
      [
        "Continuity",
        "ṁ=ρAc ของ steady single stream"
      ],
      [
        "Mach number",
        "M=c/a, ratio ความเร็วไหลต่อความเร็วเสียง"
      ],
      [
        "Choking",
        "M≈1 ที่ throat และ mass flow ถูกจำกัดตามเงื่อนไข"
      ],
      [
        "Nozzle",
        "แปลง h เป็นพลังงานจลน์"
      ],
      [
        "Diffuser",
        "ลดความเร็วเพื่อเพิ่ม static pressure"
      ],
      [
        "Throttling",
        "ลด P แบบ h₂≈h₁ ภายใต้สมมติฐาน"
      ],
      [
        "Joule–Thomson",
        "μJT=(∂T/∂P)H"
      ],
      [
        "Turbine ηt",
        "งานจริงที่ได้ ÷ งาน isentropic"
      ],
      [
        "Compressor ηc",
        "งาน isentropic ÷ งานจริงที่ป้อน"
      ],
      [
        "Pump",
        "เพิ่ม P ของเหลว; wideal≈vΔP"
      ]
    ],
    "quiz": [
      {
        "q": "Nozzle adiabatic ไม่รับงานเพลา h ที่ลดไปหลัก ๆ เป็นอะไร?",
        "options": [
          "Entropy ที่หายไป",
          "มวลใหม่",
          "ปริมาตรที่กลายเป็นศูนย์",
          "พลังงานจลน์"
        ],
        "answer": 3,
        "explanation": "energy balance แปลง Δh ไปเป็น c²/2"
      },
      {
        "q": "Steady single stream continuity คืออะไร?",
        "options": [
          "ṁ=ρAc",
          "ṁ=P/T",
          "ṁ=PV",
          "ṁ=Q/W"
        ],
        "answer": 0,
        "explanation": "มวลต่อเวลา = ความหนาแน่น × พื้นที่ × ความเร็ว"
      },
      {
        "q": "Mach number M นิยามอย่างไร?",
        "options": [
          "ความดัน/อุณหภูมิ",
          "ความเร็วไหล/ความเร็วเสียง",
          "Cp/Cv",
          "Qc/Qh"
        ],
        "answer": 1,
        "explanation": "Mach number M=c/a คืออัตราส่วนความเร็วการไหลต่อความเร็วเสียงเฉพาะที่"
      },
      {
        "q": "Throttle insulated, ΔKE≈0 ไม่มี shaft work ใช้เงื่อนไขใด?",
        "options": [
          "s₂=s₁ เสมอ",
          "T₂=T₁ เสมอ",
          "h₂≈h₁",
          "P₂=P₁"
        ],
        "answer": 2,
        "explanation": "Throttling เป็น isenthalpic ไม่ใช่ isentropic"
      },
      {
        "q": "Ideal gas μJT มีค่าใด?",
        "options": [
          "∞",
          "−R เสมอ",
          "เท่ากับ Cp",
          "0"
        ],
        "answer": 3,
        "explanation": "h ของ ideal gas ขึ้นกับ T จึง h คงที่→T คงที่"
      },
      {
        "q": "ประสิทธิภาพ Turbine ηt ควรเทียบอะไร?",
        "options": [
          "งานจริง/งาน isentropic",
          "งาน isentropic/งานจริง",
          "Q/W",
          "P₂/P₁ เท่านั้น"
        ],
        "answer": 0,
        "explanation": "turbine พยายามสร้างงาน จึงใช้งานจริงหาร ideal"
      },
      {
        "q": "ประสิทธิภาพ Compressor ηc ควรเทียบอะไร?",
        "options": [
          "งานจริง/งาน isentropic",
          "งาน isentropic/งานจริง",
          "Qh/Qc",
          "ΔP/ΔT"
        ],
        "answer": 1,
        "explanation": "compressor ใช้งานจริงมากกว่า ideal"
      },
      {
        "q": "Pump incompressible แบบ ideal งานจำเพาะ≈อะไร?",
        "options": [
          "ΔT/v",
          "Pv/T",
          "vΔP",
          "0 เสมอ"
        ],
        "answer": 2,
        "explanation": "integrate v dP เมื่อ v≈คงที่"
      },
      {
        "q": "Subsonic acceleration ผ่าน nozzle ต้องเปลี่ยนพื้นที่อย่างไร?",
        "options": [
          "พื้นที่เพิ่มเสมอ",
          "พื้นที่คงที่เสมอ",
          "ไม่เกี่ยวกับพื้นที่",
          "พื้นที่ลดลง"
        ],
        "answer": 3,
        "explanation": "สำหรับ isentropic 1D ที่ M<1 ความเร็วเพิ่มต้อง A ลด"
      },
      {
        "q": "Ejector ใช้อะไรเป็นแหล่งขับหลัก?",
        "options": [
          "Momentum ของกระแสขับ",
          "มอเตอร์เพลาเพียงอย่างเดียว",
          "ความเย็นจากภายนอกเท่านั้น",
          "แม่เหล็กเสมอ"
        ],
        "answer": 0,
        "explanation": "primary jet พากระแสรองและ diffuser คืนความดัน"
      }
    ]
  },
  "08": {
    "cards": [
      [
        "Rankine",
        "วัฏจักรไอน้ำ Pump→Boiler→Turbine→Condenser"
      ],
      [
        "Thermal efficiency",
        "η=Wnet/Qin"
      ],
      [
        "Reheat",
        "รับความร้อนเพิ่มระหว่างกังหันเพื่อลดความชื้น/ปรับประสิทธิภาพ"
      ],
      [
        "Regeneration",
        "ใช้ไอน้ำสกัดมาอุ่น feedwater"
      ],
      [
        "Extraction",
        "นำไอน้ำบางส่วนออกจาก stage ของ turbine ทำให้ ṁ เปลี่ยน"
      ],
      [
        "Otto",
        "air-standard cycle รับความร้อน V คงที่"
      ],
      [
        "Diesel",
        "air-standard cycle รับความร้อน P คงที่"
      ],
      [
        "Compression ratio r",
        "Vmax/Vmin ของ piston ideal cycle"
      ],
      [
        "Brayton",
        "Compressor→Heater→Turbine→Cooler"
      ],
      [
        "Jet vs Rocket",
        "Jet รับ oxidizer จากอากาศ; rocket บรรทุก oxidizer เอง"
      ]
    ],
    "quiz": [
      {
        "q": "อุปกรณ์ใดใน Rankine cycle เพิ่มความดันของของเหลว?",
        "options": [
          "Pump",
          "Condenser",
          "Turbine",
          "Nozzle ทางไอเสียเท่านั้น"
        ],
        "answer": 0,
        "explanation": "pump เพิ่ม P ของน้ำ feed"
      },
      {
        "q": "สูตร ηRankine คืออะไร?",
        "options": [
          "Qout/Qin",
          "Wnet/Qin",
          "Wpump/Qturbine",
          "Tc/Th"
        ],
        "answer": 1,
        "explanation": "ηใช้ net work output ต่อ heat input"
      },
      {
        "q": "ใน turbine extraction ของ steam plant ควรทำอย่างไรกับ ṁ?",
        "options": [
          "ใช้ ṁ เดียวทั้งระบบแม้มีแยกไหล",
          "ตั้ง ṁ=0 ทุกจุด",
          "ทำ mass balance ทุก section",
          "ใช้ pressure แทน mass"
        ],
        "answer": 2,
        "explanation": "flow หลัง extraction มีค่าต่ำลง"
      },
      {
        "q": "วงจร Otto รับความร้อนในอุดมคติที่อะไรคงที่?",
        "options": [
          "ความดัน",
          "เอนโทรปี",
          "อัตราการไหล",
          "ปริมาตร"
        ],
        "answer": 3,
        "explanation": "Otto heat addition เป็น constant volume"
      },
      {
        "q": "วงจร Diesel รับความร้อนในอุดมคติที่อะไรคงที่?",
        "options": [
          "ความดัน",
          "ปริมาตร",
          "ความเร็ว",
          "เอนโทรปี"
        ],
        "answer": 0,
        "explanation": "Diesel heat addition เป็น constant pressure"
      },
      {
        "q": "สมการ Otto η ใน air-standard k คงที่คืออะไร?",
        "options": [
          "1−Tc/Th เท่านั้น",
          "1−1/r^(k−1)",
          "1−r^(k−1)",
          "W/Qout"
        ],
        "answer": 1,
        "explanation": "ηOtto เพิ่มเมื่อ compression ratio r เพิ่มใน ideal model"
      },
      {
        "q": "Brayton cycle มีลำดับอุปกรณ์อะไร?",
        "options": [
          "Turbine→Condense→Pump→Boil เสมอ",
          "Valve→Pump→Boiler→Valve",
          "Compressor→Heating→Turbine→Cooling",
          "Evaporator→Comp→Cond→Valve"
        ],
        "answer": 2,
        "explanation": "แกนหลัก Brayton คือ gas turbine loop"
      },
      {
        "q": "Reheat ใน steam plant ทำเพื่ออะไร?",
        "options": [
          "ลด boiler pressure เป็นศูนย์",
          "หยุด mass flow",
          "ทำให้ไม่มี condenser",
          "รับความร้อนระหว่างขั้น turbine ลดความเปียกและปรับ cycle"
        ],
        "answer": 3,
        "explanation": "reheat เพิ่ม h อีกครั้งระหว่าง expansion stages"
      },
      {
        "q": "Flash point คืออะไร?",
        "options": [
          "อุณหภูมิที่ไอเกิดส่วนผสมติดไฟได้ตามวิธีทดสอบ",
          "อุณหภูมิที่น้ำแข็งละลาย",
          "critical temperature",
          "อุณหภูมิสูงสุดของ turbine"
        ],
        "answer": 0,
        "explanation": "flash point ไม่เหมือน fire point/autoignition"
      },
      {
        "q": "Rocket ต่างจาก air-breathing jet ในข้อใด?",
        "options": [
          "ไม่มี exhaust",
          "บรรทุก oxidizer ไปด้วย",
          "ใช้พลังงานฟรี",
          "ไม่มีสมดุลมวล"
        ],
        "answer": 1,
        "explanation": "rocket ทำงานได้แม้ไม่มีอากาศภายนอก"
      }
    ]
  },
  "09": {
    "cards": [
      [
        "Refrigerator COP",
        "QC/W มากกว่า 1 ได้"
      ],
      [
        "Carnot COPR",
        "TC/(TH−TC), T ต้องเป็น K"
      ],
      [
        "Heat pump COP",
        "QH/W=COPR+1"
      ],
      [
        "Evaporator",
        "ดูดความร้อนจากส่วนที่ต้องการทำเย็น"
      ],
      [
        "Condenser",
        "คายความร้อนสู่ภายนอก"
      ],
      [
        "Expansion valve",
        "ความดันลดแบบ h≈คงที่"
      ],
      [
        "Refrigerant",
        "สารทำงานในวงจรทำความเย็น"
      ],
      [
        "Cascade",
        "วงจรหลายขั้นแลกเปลี่ยนความร้อนระหว่างกัน"
      ],
      [
        "Absorption",
        "ใช้พลังงานความร้อนขับกระบวนการเย็น"
      ],
      [
        "Linde vs Claude",
        "Linde ใช้ throttle regenerative; Claude มี expander เสริม"
      ]
    ],
    "quiz": [
      {
        "q": "COP ของ refrigerator นิยามอย่างไร?",
        "options": [
          "W/QC",
          "QC/W",
          "QH/QC",
          "1−TC/TH"
        ],
        "answer": 1,
        "explanation": "ความเย็นที่ได้ต่อกำลังขับที่ป้อน"
      },
      {
        "q": "COP สามารถมากกว่า 1 ได้หรือไม่?",
        "options": [
          "ไม่ได้",
          "ได้ก็ต่อเมื่อไม่มี compressor",
          "ได้ ไม่ขัดพลังงานคงอยู่",
          "ได้เฉพาะ TH=TC"
        ],
        "answer": 2,
        "explanation": "เครื่องย้ายความร้อนมากกว่าพลังงานขับ"
      },
      {
        "q": "TH=300 K TC=250 K ค่า Carnot COPR เท่าไร?",
        "options": [
          "0.2",
          "1.2",
          "6",
          "5"
        ],
        "answer": 3,
        "explanation": "COPR,Carnot=TC/(TH−TC)=250/(300−250)=5 โดยใช้หน่วย K เท่านั้น"
      },
      {
        "q": "Throttling valve โดยประมาณ h₂ เป็นอย่างไร?",
        "options": [
          "เท่ากับ h₁",
          "เท่ากับ 0",
          "เพิ่มตาม P เสมอ",
          "เท่ากับ s₁"
        ],
        "answer": 0,
        "explanation": "วาล์ว insulated ไม่มีงานและ ΔKE เล็กทำให้ h≈คงที่"
      },
      {
        "q": "ส่วนใดของวงจรดูดความร้อนจากห้องเย็น?",
        "options": [
          "Condenser",
          "Evaporator",
          "Compressor",
          "Pump ในระบบ Rankine"
        ],
        "answer": 1,
        "explanation": "evaporator เป็นส่วนรับ QC"
      },
      {
        "q": "ส่วนใดมีหน้าที่คายความร้อนออกสู่สิ่งแวดล้อม?",
        "options": [
          "Evaporator",
          "Expansion valve",
          "Condenser",
          "Mixer"
        ],
        "answer": 2,
        "explanation": "Condenser เป็นเครื่องควบแน่นที่ปล่อย QH จากสารทำความเย็นสู่อากาศหรือน้ำหล่อเย็น"
      },
      {
        "q": "Heat-pump COPHP ต่างจาก COPR ภายใต้ขอบเขตเดียวกันอย่างไร?",
        "options": [
          "COPHP=COPR−1",
          "COPHP=1/COPR",
          "เท่ากับศูนย์",
          "COPHP=COPR+1"
        ],
        "answer": 3,
        "explanation": "QH=QC+W จึง QH/W=QC/W+1"
      },
      {
        "q": "Cascade refrigeration เหมาะกับสภาวะใด?",
        "options": [
          "อุณหภูมิที่ต้องการต่ำมาก/หลายขั้น",
          "น้ำที่อุณหภูมิห้องไม่มีระบบ",
          "เมื่อไม่ต้องการ refrigeration",
          "กรณี pressure ทุกช่วงเท่ากัน"
        ],
        "answer": 0,
        "explanation": "ใช้สอง stage แบ่ง lift"
      },
      {
        "q": "Absorption refrigeration ใช้อะไรขับหลัก?",
        "options": [
          "ไฟฟ้าจ่าย compressor หลักเพียงอย่างเดียว",
          "พลังงานความร้อนให้ generator",
          "ไม่มี input",
          "พลังงานศูนย์"
        ],
        "answer": 1,
        "explanation": "heat-driven cycle ใช้ absorber/generator"
      },
      {
        "q": "Claude เพิ่มอุปกรณ์ใดจาก Linde แบบพื้นฐาน?",
        "options": [
          "Boiler ไอน้ำแรงดันต่ำเท่านั้น",
          "Spark plug",
          "Expander",
          "Evaporator บ้าน"
        ],
        "answer": 2,
        "explanation": "Claude ใช้ expander สร้างความเย็นพร้อมผลิตงาน"
      }
    ]
  }
};
