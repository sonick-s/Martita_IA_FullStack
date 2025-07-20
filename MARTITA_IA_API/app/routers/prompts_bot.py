from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.prompts_bot import PromptBotCreate, PromptBotUpdate, PromptBotRead
from app.controllers import (
    get_prompts,
    get_prompt,
    create_prompt,
    update_prompt,
    delete_prompt,
)

router = APIRouter(prefix="/prompts-bot", tags=["Prompts Bot"])

@router.get("/", response_model=List[PromptBotRead])
async def read_prompts(db: AsyncSession = Depends(get_db)):
    return await get_prompts(db)

@router.get("/{id_prompt}", response_model=PromptBotRead)
async def read_prompt(id_prompt: int, db: AsyncSession = Depends(get_db)):
    prompt = await get_prompt(db, id_prompt)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt no encontrado")
    return prompt

@router.post("/", response_model=PromptBotRead, status_code=status.HTTP_201_CREATED)
async def create_nuevo_prompt(prompt: PromptBotCreate, db: AsyncSession = Depends(get_db)):
    return await create_prompt(prompt, db)

@router.put("/{id_prompt}", response_model=PromptBotRead)
async def actualizar_prompt(id_prompt: int, prompt: PromptBotUpdate, db: AsyncSession = Depends(get_db)):
    prompt = await update_prompt(id_prompt, prompt, db)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt no encontrado")
    return prompt

@router.delete("/{id_prompt}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_prompt(id_prompt: int, db: AsyncSession = Depends(get_db)):
    prompt = await delete_prompt(id_prompt, db)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt no encontrado")
    return None
