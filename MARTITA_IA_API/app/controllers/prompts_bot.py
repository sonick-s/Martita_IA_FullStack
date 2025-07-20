from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.prompts_bot import PromptsBot
from app.schemas.prompts_bot import PromptBotCreate, PromptBotUpdate

async def get_prompt(db: AsyncSession, prompt_id: int):
    result = await db.execute(select(PromptsBot).filter(PromptsBot.id_prompt == prompt_id))
    return result.scalar_one_or_none()

async def get_prompts(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(PromptsBot).offset(skip).limit(limit))
    return result.scalars().all()

async def create_prompt(prompt: PromptBotCreate, db: AsyncSession):
    db_prompt = PromptsBot(**prompt.model_dump())
    db.add(db_prompt)
    await db.commit()
    await db.refresh(db_prompt)
    return db_prompt

async def update_prompt(prompt_id: int, prompt: PromptBotUpdate, db: AsyncSession):
    result = await db.execute(select(PromptsBot).filter(PromptsBot.id_prompt == prompt_id))
    db_prompt = result.scalar_one_or_none()
    if not db_prompt:
        return None
    for var, value in prompt.model_dump(exclude_unset=True).items():
        setattr(db_prompt, var, value)
    await db.commit()
    await db.refresh(db_prompt)
    return db_prompt

async def delete_prompt(prompt_id: int, db: AsyncSession):
    result = await db.execute(select(PromptsBot).filter(PromptsBot.id_prompt == prompt_id))
    db_prompt = result.scalar_one_or_none()
    if not db_prompt:
        return None
    await db.delete(db_prompt)
    await db.commit()
    return db_prompt
