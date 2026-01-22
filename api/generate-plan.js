export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { goal, totalMinutes, hours, minutes } = req.body;

  // 입력 검증
  if (!goal || !goal.trim()) {
    return res.status(400).json({ error: '목표를 입력해주세요' });
  }

  if (totalMinutes < 30) {
    return res.status(400).json({ error: '최소 30분 이상의 시간을 입력해주세요' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `당신은 실행 가능한 계획을 만드는 전문가입니다.

사용자의 추상적인 목표: "${goal}"
사용자가 사용 가능한 시간: ${totalMinutes}분 (${hours}시간 ${minutes}분)

다음 규칙을 따라 JSON 형식으로 응답해주세요:
1. 주어진 시간 내에 실제로 완료 가능한 구체적인 단계들로 쪼개기
2. 각 단계는 명확하고 실행 가능해야 함
3. 각 단계별 예상 소요시간 포함 (분 단위)
4. 총 시간이 사용 가능한 시간을 초과하지 않도록
5. 만약 목표가 너무 크면, 오늘 할 수 있는 부분만 제시하고 다음 단계 안내

JSON 형식 (다른 텍스트 없이 이것만):
{
  "tasks": [
    {"step": "단계명", "duration": 30, "description": "구체적 설명"}
  ],
  "totalTime": 120,
  "nextSteps": "이 목표를 완전히 달성하려면 추가로 필요한 작업 (선택적)"
}`
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API Error:', errorData);
      return res.status(500).json({ error: 'API 호출 실패' });
    }

    const data = await response.json();
    const text = data.content.find(c => c.type === 'text')?.text || '';

    // JSON 파싱
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.status(200).json(parsed);
    } else {
      return res.status(500).json({ error: '응답 파싱 실패' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
}
