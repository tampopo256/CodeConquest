// カードドロー
function drawCard(player) {
    if (gameState.deck.length === 0) {
        gameState.deck = [...CARDS]; // デッキをリシャッフル
    }

    const randomIndex = Math.floor(Math.random() * gameState.deck.length);
    const baseCard = gameState.deck[randomIndex];
    
    // カードのコピーを作成してuniqueIdを追加
    const card = {
        ...baseCard,
        uniqueId: Date.now() + Math.random() + '_' + player
    };
    
    if (player === 'player' && gameState.playerHand.length < 7) {
        gameState.playerHand.push(card);
    } else if (player === 'ai' && gameState.aiHand.length < 7) {
        gameState.aiHand.push(card);
    }
}        

// 外部JSONファイルからカードデータを読み込む関数
async function loadCardsFromJSON() {
    try {
        const response = await fetch('cards.json');
        if (response.ok) {
            const cardsData = await response.json();
            CARDS = cardsData.cards || CARDS;
            console.log('カードデータを外部ファイルから読み込みました');
        } else {
            console.log('外部ファイルが見つかりません。デフォルトカードを使用します');
        }
    } catch (error) {
        console.log('外部ファイル読み込みエラー。デフォルトカードを使用します:', error);
    }
}

// ゲーム状態
let gameState = {
    playerHp: 100,
    aiHp: 100,
    playerHand: [],
    aiHand: [],
    selectedCards: [],
    turn: 'player',
    playerEffects: {},
    aiEffects: {},
    lastUsedCard: null,
    gameOver: false,
    deck: [],
    // セキュリティシステム
    playerSecurityLevel: 0,
    aiSecurityLevel: 0,
    worldSecurityLevel: 1,
    turnCount: 0
};

// DOM要素
const elements = {
    playerHpFill: document.getElementById('player-hp-fill'),
    playerHpText: document.getElementById('player-hp-text'),
    aiHpFill: document.getElementById('ai-hp-fill'),
    aiHpText: document.getElementById('ai-hp-text'),
    aiHandCount: document.getElementById('ai-hand-count'),
    turnIndicator: document.getElementById('turn-indicator'),
    effectsDisplay: document.getElementById('effects-display'),
    playerHand: document.getElementById('player-hand'),
    selectedCount: document.getElementById('selected-count'),
    playCardsBtn: document.getElementById('play-cards-btn'),
    endTurnBtn: document.getElementById('end-turn-btn'),
    newGameBtn: document.getElementById('new-game-btn'),
    gameLog: document.getElementById('game-log'),
    // セキュリティ要素
    playerSecurity: document.getElementById('player-security'),
    aiSecurity: document.getElementById('ai-security'),
    worldSecurity: document.getElementById('world-security'),
    // カードガイド要素
    cardGuideBtn: document.getElementById('card-guide-btn'),
    cardGuide: document.getElementById('card-guide'),
    cardGuideGrid: document.getElementById('card-guide-grid')
};

// ゲーム初期化
async function initGame() {
    // カードデータを読み込み
    await loadCardsFromJSON();
    
    gameState = {
        playerHp: 100,
        aiHp: 100,
        playerHand: [],
        aiHand: [],
        selectedCards: [],
        turn: 'player',
        playerEffects: {},
        aiEffects: {},
        lastUsedCard: null,
        gameOver: false,
        deck: [...CARDS], // CARDSが読み込まれた後に設定
        // セキュリティシステム
        playerSecurityLevel: 0,
        aiSecurityLevel: 0,
        worldSecurityLevel: 1,
        turnCount: 0
    };

    // 初期手札配布
    for (let i = 0; i < 5; i++) {
        drawCard('player');
        drawCard('ai');
    }

    updateUI();
    addLogEntry('ゲーム開始！世界セキュリティ要求レベルは段階的に上昇します。', 'system');
}

// 世界セキュリティレベル上昇処理
function updateWorldSecurityLevel() {
    const currentTurn = gameState.turnCount;
    
    if (currentTurn <= 5) {
        // 1-5ターン目：セキュリティレベル上昇なし
        addLogEntry(`ターン${currentTurn}：世界はまだ平和です。セキュリティレベル変動なし`, 'system');
        return;
    } else if (currentTurn <= 30) {
        // 6-30ターン目：毎ターン確実に+1
        gameState.worldSecurityLevel++;
        addLogEntry(`ターン${currentTurn}：脅威が増加！セキュリティレベルが${gameState.worldSecurityLevel}に上昇`, 'system');
    } else {
        // 31ターン目以降：ランダムで上昇（50%の確率）
        if (Math.random() < 0.5) {
            gameState.worldSecurityLevel++;
            addLogEntry(`ターン${currentTurn}：予期しない脅威！セキュリティレベルが${gameState.worldSecurityLevel}に上昇`, 'system');
        } else {
            addLogEntry(`ターン${currentTurn}：脅威レベル安定。セキュリティレベル${gameState.worldSecurityLevel}を維持`, 'system');
        }
    }
}
function drawCard(player) {
    if (gameState.deck.length === 0) {
        gameState.deck = [...CARDS]; // デッキをリシャッフル
    }

    const randomIndex = Math.floor(Math.random() * gameState.deck.length);
    const baseCard = gameState.deck[randomIndex];
    
    // カードのコピーを作成してuniqueIdを追加
    const card = {
        ...baseCard,
        uniqueId: Date.now() + Math.random() + '_' + player
    };
    
    if (player === 'player' && gameState.playerHand.length < 7) {
        gameState.playerHand.push(card);
    } else if (player === 'ai' && gameState.aiHand.length < 7) {
        gameState.aiHand.push(card);
    }
}

// UI更新
function updateUI() {
    // HP更新
    const playerHpPercent = (gameState.playerHp / 100) * 100;
    const aiHpPercent = (gameState.aiHp / 100) * 100;
    
    elements.playerHpFill.style.width = `${playerHpPercent}%`;
    elements.playerHpText.textContent = `${gameState.playerHp}/100`;
    elements.aiHpFill.style.width = `${aiHpPercent}%`;
    elements.aiHpText.textContent = `${gameState.aiHp}/100`;
    elements.aiHandCount.textContent = `手札: ${gameState.aiHand.length}枚`;

    // セキュリティ更新
    updateSecurityDisplay();

    // ターン表示
    elements.turnIndicator.textContent = gameState.turn === 'player' ? 'あなたのターン' : 'AIのターン';

    // 効果表示
    updateEffectsDisplay();

    // 手札表示
    updateHandDisplay();

    // ボタン状態
    elements.playCardsBtn.disabled = gameState.selectedCards.length === 0 || gameState.turn !== 'player';
    elements.endTurnBtn.disabled = gameState.turn !== 'player';
}

// セキュリティ表示更新
function updateSecurityDisplay() {
    // プレイヤーセキュリティ
    elements.playerSecurity.textContent = gameState.playerSecurityLevel;
    elements.playerSecurity.className = 'security-level ' + 
        (gameState.playerSecurityLevel >= gameState.worldSecurityLevel ? 'security-safe' : 'security-danger');

    // AIセキュリティ
    elements.aiSecurity.textContent = gameState.aiSecurityLevel;
    elements.aiSecurity.className = 'security-level ' + 
        (gameState.aiSecurityLevel >= gameState.worldSecurityLevel ? 'security-safe' : 'security-danger');

    // 世界セキュリティ
    elements.worldSecurity.textContent = `🌐 世界セキュリティ要求レベル: ${gameState.worldSecurityLevel}`;
}

// 不正アクセス処理
function processSecurityAttacks() {
    // プレイヤーへの不正アクセス
    if (gameState.playerSecurityLevel < gameState.worldSecurityLevel) {
        const damage = Math.floor(Math.random() * 11) + 5; // 5～15ダメージ
        gameState.playerHp = Math.max(0, gameState.playerHp - damage);
        addLogEntry(`🚨 プレイヤーが不正アクセスを受けて${damage}ダメージ！`, 'system');
    }

    // AIへの不正アクセス
    if (gameState.aiSecurityLevel < gameState.worldSecurityLevel) {
        const damage = Math.floor(Math.random() * 11) + 5; // 5～15ダメージ
        gameState.aiHp = Math.max(0, gameState.aiHp - damage);
        addLogEntry(`🚨 AIが不正アクセスを受けて${damage}ダメージ！`, 'system');
    }
}

// 効果表示更新
function updateEffectsDisplay() {
    const effects = [];
    
    // プレイヤー効果
    Object.keys(gameState.playerEffects).forEach(effect => {
        if (gameState.playerEffects[effect] > 0) {
            effects.push(`👤 ${effect}: ${gameState.playerEffects[effect]}ターン`);
        }
    });

    // AI効果
    Object.keys(gameState.aiEffects).forEach(effect => {
        if (gameState.aiEffects[effect] > 0) {
            effects.push(`🤖 ${effect}: ${gameState.aiEffects[effect]}ターン`);
        }
    });

    elements.effectsDisplay.innerHTML = effects.map(effect => 
        `<div class="effect">${effect}</div>`
    ).join('');
}

// 手札表示更新
function updateHandDisplay() {
    elements.playerHand.innerHTML = gameState.playerHand.map(card => `
        <div class="card ${gameState.selectedCards.includes(card.uniqueId) ? 'selected' : ''}" 
             data-type="${card.type}"
             onclick="toggleCardSelection('${card.uniqueId}')">
            <div class="card-name">${card.name}</div>
            <div class="card-type">${card.type}</div>
            <div class="card-effect">${card.effect}</div>
        </div>
    `).join('');

    elements.selectedCount.textContent = `(${gameState.selectedCards.length}/1枚選択中)`;
}

// カード選択切り替え
function toggleCardSelection(uniqueId) {
    if (gameState.turn !== 'player') return;

    const index = gameState.selectedCards.indexOf(uniqueId);
    if (index > -1) {
        gameState.selectedCards.splice(index, 1);
    } else if (gameState.selectedCards.length < 1) { // 1枚まで選択可能
        gameState.selectedCards.push(uniqueId);
    }

    updateUI();
}

// アニメーション表示関数
function showCardAnimation(card, isAI = false) {
    const animationCard = document.createElement('div');
    animationCard.className = 'card ai-card-animation';
    animationCard.setAttribute('data-type', card.type);
    animationCard.innerHTML = `
        <div class="card-name">${card.name}</div>
        <div class="card-type">${card.type}</div>
        <div class="card-effect">${card.effect}</div>
    `;
    
    document.body.appendChild(animationCard);
    
    setTimeout(() => {
        document.body.removeChild(animationCard);
    }, 2000);
}

// ダメージアニメーション
function showDamageAnimation(damage, isPlayer = false) {
    const targetElement = isPlayer ? elements.playerHpText : elements.aiHpText;
    const rect = targetElement.getBoundingClientRect();
    
    const damageElement = document.createElement('div');
    damageElement.className = 'damage-animation';
    damageElement.textContent = `-${damage}`;
    damageElement.style.left = `${rect.left + window.scrollX}px`;
    damageElement.style.top = `${rect.top + window.scrollY}px`;
    
    document.body.appendChild(damageElement);
    
    setTimeout(() => {
        document.body.removeChild(damageElement);
    }, 1500);
}

// 回復アニメーション
function showHealAnimation(heal, isPlayer = false) {
    const targetElement = isPlayer ? elements.playerHpText : elements.aiHpText;
    const rect = targetElement.getBoundingClientRect();
    
    const healElement = document.createElement('div');
    healElement.className = 'heal-animation';
    healElement.textContent = `+${heal}`;
    healElement.style.left = `${rect.left + window.scrollX}px`;
    healElement.style.top = `${rect.top + window.scrollY}px`;
    
    document.body.appendChild(healElement);
    
    setTimeout(() => {
        document.body.removeChild(healElement);
    }, 1500);
}

// カード使用
function playSelectedCards() {
    if (gameState.selectedCards.length === 0 || gameState.turn !== 'player') return;

    const cardsToPlay = [];
    
    // 選択されたカードを安全に取得
    gameState.selectedCards.forEach(uniqueId => {
        const card = gameState.playerHand.find(card => card.uniqueId === uniqueId);
        if (card) {
            cardsToPlay.push(card);
        }
    });

    // カードを手札から削除
    gameState.selectedCards.forEach(uniqueId => {
        const index = gameState.playerHand.findIndex(card => card.uniqueId === uniqueId);
        if (index > -1) {
            gameState.playerHand.splice(index, 1);
        }
    });

    gameState.selectedCards = [];

    // カード効果実行
    cardsToPlay.forEach(card => {
        if (card && card.name) {
            executeCard(card, 'player');
        }
    });

    updateUI();
    
    // 1枚カードを出したら必ずターン終了
    setTimeout(() => {
        endTurn();
    }, 1000);
}

// カード効果実行
function executeCard(card, player) {
    // カードの存在確認
    if (!card || !card.name || !card.action) {
        console.error('Invalid card:', card);
        return;
    }

    const isPlayer = player === 'player';
    const target = isPlayer ? 'ai' : 'player';
    
    addLogEntry(`${isPlayer ? '👤' : '🤖'} ${card.name}を使用！`, isPlayer ? 'player' : 'ai');

    switch (card.action) {
        case 'attack':
            let damage = card.value;
            if (card.value === 'random_multi') {
                const attacks = Math.floor(Math.random() * 3) + 1;
                damage = attacks * 8;
                addLogEntry(`${attacks}回攻撃で${damage}ダメージ！`, isPlayer ? 'player' : 'ai');
            }

            // ダメージ倍化効果
            if (isPlayer && gameState.playerEffects.double_damage > 0) {
                damage *= 2;
                gameState.playerEffects.double_damage--;
                addLogEntry('ダメージが2倍になった！', 'player');
            }
            if (!isPlayer && gameState.aiEffects.double_damage > 0) {
                damage *= 2;
                gameState.aiEffects.double_damage--;
                addLogEntry('AIのダメージが2倍になった！', 'ai');
            }

            // 防御効果チェック
            if (isPlayer && gameState.aiEffects.block_next > 0) {
                damage = 0;
                gameState.aiEffects.block_next--;
                addLogEntry('攻撃が無効化された！', 'system');
            }
            if (!isPlayer && gameState.playerEffects.block_next > 0) {
                damage = 0;
                gameState.playerEffects.block_next--;
                addLogEntry('攻撃が無効化された！', 'system');
            }

            if (damage > 0) {
                if (isPlayer) {
                    gameState.aiHp = Math.max(0, gameState.aiHp - damage);
                    showDamageAnimation(damage, false);
                } else {
                    gameState.playerHp = Math.max(0, gameState.playerHp - damage);
                    showDamageAnimation(damage, true);
                }
                addLogEntry(`${damage}ダメージ！`, isPlayer ? 'player' : 'ai');
            }
            break;

        case 'condition':
            if (card.value === 'double_damage') {
                if (isPlayer) {
                    gameState.playerEffects.double_damage = 1;
                } else {
                    gameState.aiEffects.double_damage = 1;
                }
                addLogEntry('次の攻撃ダメージが2倍になる！', isPlayer ? 'player' : 'ai');
            }
            break;

        case 'security_defense':
            if (isPlayer) {
                gameState.playerSecurityLevel += card.value;
                gameState.playerEffects.block_next = 1;
            } else {
                gameState.aiSecurityLevel += card.value;
                gameState.aiEffects.block_next = 1;
            }
            addLogEntry(`防御レベル+${card.value}、次の攻撃を無効化！`, isPlayer ? 'player' : 'ai');
            break;

        case 'security_attack':
            if (card.value === 'damage_debuff') {
                // ダメージ
                let attackDamage = 10;
                if (isPlayer && gameState.aiEffects.block_next > 0) {
                    attackDamage = 0;
                    gameState.aiEffects.block_next--;
                    addLogEntry('攻撃が無効化された！', 'system');
                } else if (!isPlayer && gameState.playerEffects.block_next > 0) {
                    attackDamage = 0;
                    gameState.playerEffects.block_next--;
                    addLogEntry('攻撃が無効化された！', 'system');
                }

                if (attackDamage > 0) {
                    if (isPlayer) {
                        gameState.aiHp = Math.max(0, gameState.aiHp - attackDamage);
                        gameState.aiSecurityLevel = Math.max(0, gameState.aiSecurityLevel - 1);
                    } else {
                        gameState.playerHp = Math.max(0, gameState.playerHp - attackDamage);
                        gameState.playerSecurityLevel = Math.max(0, gameState.playerSecurityLevel - 1);
                    }
                    addLogEntry(`${attackDamage}ダメージ + 防御レベル-1！`, isPlayer ? 'player' : 'ai');
                }
            }
            break;

        case 'firewall':
            if (isPlayer) {
                gameState.playerSecurityLevel += card.value;
                gameState.playerEffects.firewall_active = 1;
            } else {
                gameState.aiSecurityLevel += card.value;
                gameState.aiEffects.firewall_active = 1;
            }
            addLogEntry(`ファイアウォール起動！防御レベル+${card.value}（攻撃不可）`, isPlayer ? 'player' : 'ai');
            break;

        case 'security_heal':
            if (isPlayer) {
                gameState.playerSecurityLevel += card.value;
                gameState.playerHp = Math.min(100, gameState.playerHp + 5);
            } else {
                gameState.aiSecurityLevel += card.value;
                gameState.aiHp = Math.min(100, gameState.aiHp + 5);
            }
            addLogEntry(`暗号化完了！防御レベル+${card.value}、HP+5回復`, isPlayer ? 'player' : 'ai');
            break;

        case 'security_disruption':
            let disruptionDamage = 8;
            if (isPlayer && gameState.aiEffects.block_next > 0) {
                disruptionDamage = 0;
                gameState.aiEffects.block_next--;
                addLogEntry('攻撃が無効化された！', 'system');
            } else if (!isPlayer && gameState.playerEffects.block_next > 0) {
                disruptionDamage = 0;
                gameState.playerEffects.block_next--;
                addLogEntry('攻撃が無効化された！', 'system');
            }

            if (disruptionDamage > 0) {
                if (isPlayer) {
                    gameState.aiHp = Math.max(0, gameState.aiHp - disruptionDamage);
                    gameState.aiSecurityLevel = Math.max(0, gameState.aiSecurityLevel - card.value);
                } else {
                    gameState.playerHp = Math.max(0, gameState.playerHp - disruptionDamage);
                    gameState.playerSecurityLevel = Math.max(0, gameState.playerSecurityLevel - card.value);
                }
                addLogEntry(`DDoS攻撃！${disruptionDamage}ダメージ + 防御レベル-${card.value}`, isPlayer ? 'player' : 'ai');
            }
            break;

        case 'heal':
            if (isPlayer) {
                gameState.playerHp = Math.min(100, gameState.playerHp + card.value);
                showHealAnimation(card.value, true);
            } else {
                gameState.aiHp = Math.min(100, gameState.aiHp + card.value);
                showHealAnimation(card.value, false);
            }
            addLogEntry(`${card.value}HP回復！`, isPlayer ? 'player' : 'ai');
            break;

        case 'draw':
            for (let i = 0; i < card.value; i++) {
                drawCard(player);
            }
            addLogEntry(`${card.value}枚ドロー！`, isPlayer ? 'player' : 'ai');
            break;

        case 'debuff':
            if (card.value === 'skip_turn') {
                if (isPlayer) {
                    gameState.playerEffects.skip_turn = 1;
                } else {
                    gameState.aiEffects.skip_turn = 1;
                }
                addLogEntry('次のターンをスキップする！', isPlayer ? 'player' : 'ai');
            }
            break;

        case 'status':
            if (card.value === 'stun_damage') {
                if (isPlayer) {
                    gameState.aiHp = Math.max(0, gameState.aiHp - 10);
                    gameState.aiEffects.stunned = 1;
                } else {
                    gameState.playerHp = Math.max(0, gameState.playerHp - 10);
                    gameState.playerEffects.stunned = 1;
                }
                addLogEntry('10ダメージ + 1ターン行動不能！', isPlayer ? 'player' : 'ai');
            }
            break;

        case 'combo':
            if (card.value === 'repeat_last' && gameState.lastUsedCard) {
                addLogEntry('前のカード効果を再発動！', isPlayer ? 'player' : 'ai');
                executeCard(gameState.lastUsedCard, player);
            }
            break;

        case 'leak':
            // 情報漏洩：相手の手札を1枚見て選んで破棄、さらに5ダメージ
            const targetHand = isPlayer ? gameState.aiHand : gameState.playerHand;
            if (targetHand.length > 0) {
                const randomIndex = Math.floor(Math.random() * targetHand.length);
                const discardedCard = targetHand.splice(randomIndex, 1)[0];
                addLogEntry(`${discardedCard.name}を破棄！`, isPlayer ? 'player' : 'ai');
            }
            
            let leakDamage = card.value;
            if (isPlayer && gameState.aiEffects.block_next > 0) {
                leakDamage = 0;
                gameState.aiEffects.block_next--;
                addLogEntry('攻撃が無効化された！', 'system');
            } else if (!isPlayer && gameState.playerEffects.block_next > 0) {
                leakDamage = 0;
                gameState.playerEffects.block_next--;
                addLogEntry('攻撃が無効化された！', 'system');
            }

            if (leakDamage > 0) {
                if (isPlayer) {
                    gameState.aiHp = Math.max(0, gameState.aiHp - leakDamage);
                    showDamageAnimation(leakDamage, false);
                } else {
                    gameState.playerHp = Math.max(0, gameState.playerHp - leakDamage);
                    showDamageAnimation(leakDamage, true);
                }
                addLogEntry(`情報漏洩で${leakDamage}ダメージ！`, isPlayer ? 'player' : 'ai');
            }
            break;

        case 'phishing':
            // フィッシング詐欺：相手の次のターン、ドローできなくなる
            if (isPlayer) {
                gameState.aiEffects.no_draw = 1;
            } else {
                gameState.playerEffects.no_draw = 1;
            }
            addLogEntry('フィッシング詐欺！次のターンはドローできない', isPlayer ? 'player' : 'ai');
            break;

        case 'detox':
            // デジタルデトックス：HP10回復 + 状態異常を1つ解除
            if (isPlayer) {
                gameState.playerHp = Math.min(100, gameState.playerHp + card.value);
                showHealAnimation(card.value, true);
                // 状態異常解除
                const negativeEffects = ['stunned', 'skip_turn', 'no_draw'];
                for (let effect of negativeEffects) {
                    if (gameState.playerEffects[effect] > 0) {
                        gameState.playerEffects[effect] = 0;
                        addLogEntry(`${effect}効果を解除！`, 'player');
                        break;
                    }
                }
            } else {
                gameState.aiHp = Math.min(100, gameState.aiHp + card.value);
                showHealAnimation(card.value, false);
                const negativeEffects = ['stunned', 'skip_turn', 'no_draw'];
                for (let effect of negativeEffects) {
                    if (gameState.aiEffects[effect] > 0) {
                        gameState.aiEffects[effect] = 0;
                        addLogEntry(`AI${effect}効果を解除！`, 'ai');
                        break;
                    }
                }
            }
            addLogEntry(`デジタルデトックス！${card.value}HP回復`, isPlayer ? 'player' : 'ai');
            break;

        case 'inclusive_code':
            // ジェンダー配慮コード：次の「コンボ系」カードが無条件で成功
            if (isPlayer) {
                gameState.playerEffects.combo_success = 1;
            } else {
                gameState.aiEffects.combo_success = 1;
            }
            addLogEntry('次のコンボ系カードが必ず成功！', isPlayer ? 'player' : 'ai');
            break;

        case 'deepfake_block':
            // ディープフェイク対策：相手の特殊カード効果を1回無効化
            if (isPlayer) {
                gameState.aiEffects.special_blocked = 1;
            } else {
                gameState.playerEffects.special_blocked = 1;
            }
            addLogEntry('相手の特殊カード効果を無効化準備！', isPlayer ? 'player' : 'ai');
            break;

        case 'blackbox_test':
            // ブラックボックステスト：相手のランダムな効果を封じる＋8ダメージ
            const targetEffects = isPlayer ? gameState.aiEffects : gameState.playerEffects;
            const activeEffects = Object.keys(targetEffects).filter(key => targetEffects[key] > 0);
            if (activeEffects.length > 0) {
                const randomEffect = activeEffects[Math.floor(Math.random() * activeEffects.length)];
                targetEffects[randomEffect] = 0;
                addLogEntry(`${randomEffect}効果を封じた！`, isPlayer ? 'player' : 'ai');
            }
            
            let testDamage = card.value;
            if (isPlayer && gameState.aiEffects.block_next > 0) {
                testDamage = 0;
                gameState.aiEffects.block_next--;
                addLogEntry('攻撃が無効化された！', 'system');
            } else if (!isPlayer && gameState.playerEffects.block_next > 0) {
                testDamage = 0;
                gameState.playerEffects.block_next--;
                addLogEntry('攻撃が無効化された！', 'system');
            }

            if (testDamage > 0) {
                if (isPlayer) {
                    gameState.aiHp = Math.max(0, gameState.aiHp - testDamage);
                    showDamageAnimation(testDamage, false);
                } else {
                    gameState.playerHp = Math.max(0, gameState.playerHp - testDamage);
                    showDamageAnimation(testDamage, true);
                }
                addLogEntry(`ブラックボックステストで${testDamage}ダメージ！`, isPlayer ? 'player' : 'ai');
            }
            break;

        case 'zero_trust':
            // ゼロトラスト認証：次のターン中、すべての攻撃を1回だけ無効化
            if (isPlayer) {
                gameState.playerEffects.zero_trust_active = 1;
            } else {
                gameState.aiEffects.zero_trust_active = 1;
            }
            addLogEntry('ゼロトラスト認証起動！次のターンの攻撃を無効化', isPlayer ? 'player' : 'ai');
            break;
    }

    gameState.lastUsedCard = card;
}

// AIターン
function aiTurn() {
    if (gameState.aiEffects.skip_turn > 0) {
        gameState.aiEffects.skip_turn--;
        addLogEntry('🤖 AIはターンをスキップした', 'ai');
        endTurn();
        return;
    }

    if (gameState.aiEffects.stunned > 0) {
        gameState.aiEffects.stunned--;
        addLogEntry('🤖 AIは行動不能', 'ai');
        endTurn();
        return;
    }

    // AI戦略（セキュリティ考慮）
    const availableCards = [...gameState.aiHand];
    let cardToPlay = null;

    // セキュリティが不足している場合は防御優先
    if (gameState.aiSecurityLevel < gameState.worldSecurityLevel) {
        const securityCards = availableCards.filter(card => 
            card.action === 'security_defense' || 
            card.action === 'firewall' || 
            card.action === 'security_heal'
        );
        if (securityCards.length > 0) {
            cardToPlay = securityCards[Math.floor(Math.random() * securityCards.length)];
        }
    }

    // HPが低い時は回復・防御優先
    if (!cardToPlay && gameState.aiHp <= 30) {
        const healCard = availableCards.find(card => 
            card.action === 'heal' || card.action === 'security_heal'
        );
        if (healCard) {
            cardToPlay = healCard;
        }
    }

    // ファイアウォールが有効でなければ攻撃カード
    if (!cardToPlay && !gameState.aiEffects.firewall_active) {
        const attackCards = availableCards.filter(card => 
            card.action === 'attack' || 
            card.action === 'security_attack' || 
            card.action === 'security_disruption'
        );
        if (attackCards.length > 0) {
            cardToPlay = attackCards[Math.floor(Math.random() * attackCards.length)];
        }
    }

    // ランダムで1枚選択
    if (!cardToPlay && availableCards.length > 0) {
        const remainingCards = availableCards.filter(card => {
            // ファイアウォール有効時は攻撃系カードを避ける
            if (gameState.aiEffects.firewall_active && 
                (card.action === 'attack' || 
                 card.action === 'security_attack' || 
                 card.action === 'security_disruption')) {
                return false;
            }
            return true;
        });
        if (remainingCards.length > 0) {
            cardToPlay = remainingCards[Math.floor(Math.random() * remainingCards.length)];
        }
    }

    // カードを手札から削除して実行
    if (cardToPlay) {
        const index = gameState.aiHand.findIndex(c => c.uniqueId === cardToPlay.uniqueId);
        if (index > -1) {
            gameState.aiHand.splice(index, 1);
        }
        
        // AIカードアニメーション表示
        showCardAnimation(cardToPlay, true);
        
        setTimeout(() => {
            executeCard(cardToPlay, 'ai');
            updateUI();
        }, 1000);
    }

    setTimeout(() => {
        endTurn();
    }, 1500);
}

// ターン終了
function endTurn() {
    // ターンカウント増加とセキュリティレベル処理
    if (gameState.turn === 'ai') {
        gameState.turnCount++;
        updateWorldSecurityLevel();
    }

    // 不正アクセス処理
    processSecurityAttacks();

    // 効果ターン数減少
    Object.keys(gameState.playerEffects).forEach(effect => {
        if (gameState.playerEffects[effect] > 0) {
            gameState.playerEffects[effect]--;
        }
    });
    Object.keys(gameState.aiEffects).forEach(effect => {
        if (gameState.aiEffects[effect] > 0) {
            gameState.aiEffects[effect]--;
        }
    });

    // ゲーム終了チェック
    if (gameState.playerHp <= 0 || gameState.aiHp <= 0) {
        endGame();
        return;
    }

    // ターン切り替え
    if (gameState.turn === 'player') {
        // フィッシング効果チェック
        if (!gameState.playerEffects.no_draw) {
            drawCard('player');
        } else {
            addLogEntry('フィッシング詐欺の影響でドローできない！', 'player');
        }
        gameState.turn = 'ai';
        updateUI();
        setTimeout(() => aiTurn(), 1000);
    } else {
        // フィッシング効果チェック
        if (!gameState.aiEffects.no_draw) {
            drawCard('ai');
        } else {
            addLogEntry('AIもフィッシング詐欺の影響でドローできない！', 'ai');
        }
        gameState.turn = 'player';
        
        // プレイヤーがスキップターン効果を受けている場合
        if (gameState.playerEffects.skip_turn > 0) {
            gameState.playerEffects.skip_turn--;
            addLogEntry('👤 プレイヤーはターンをスキップ', 'player');
            setTimeout(() => endTurn(), 1000);
            return;
        }
        
        updateUI();
    }
}

// ゲーム終了
function endGame() {
    gameState.gameOver = true;
    const winner = gameState.playerHp > 0 ? 'player' : 'ai';
    
    const gameOverDiv = document.createElement('div');
    gameOverDiv.className = 'game-over';
    gameOverDiv.innerHTML = `
        <div class="game-over-content">
            <h2>${winner === 'player' ? '🎉 勝利！' : '😢 敗北...'}</h2>
            <p>${winner === 'player' ? 'おめでとうございます！' : 'また挑戦してください！'}</p>
            <button class="btn" onclick="this.parentElement.parentElement.remove(); initGame();">
                新しいゲーム
            </button>
        </div>
    `;
    document.body.appendChild(gameOverDiv);

    addLogEntry(`ゲーム終了！ ${winner === 'player' ? 'プレイヤー' : 'AI'}の勝利！`, 'system');
}

// ログ追加
function addLogEntry(message, type = 'system') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.textContent = message;
    elements.gameLog.appendChild(logEntry);
    elements.gameLog.scrollTop = elements.gameLog.scrollHeight;
}

// カードガイド表示
function showCardGuide() {
    const grid = elements.cardGuideGrid;
    grid.innerHTML = CARDS.map(card => `
        <div class="card-guide-item">
            <div class="card-guide-header">
                <div class="card-guide-name">${card.name}</div>
                <div class="card-guide-type">${card.type}</div>
            </div>
            <div class="card-guide-effect">${card.effect}</div>
            <div class="card-guide-description">${card.description}</div>
        </div>
    `).join('');
    
    elements.cardGuide.style.display = 'flex';
}

// カードガイド閉じる
function closeCardGuide() {
    elements.cardGuide.style.display = 'none';
}

// イベントリスナー
elements.playCardsBtn.addEventListener('click', playSelectedCards);
elements.endTurnBtn.addEventListener('click', endTurn);
elements.newGameBtn.addEventListener('click', initGame);
elements.cardGuideBtn.addEventListener('click', showCardGuide);

// グローバル関数として定義（HTML内のonclickで使用）
window.closeCardGuide = closeCardGuide;
window.toggleCardSelection = toggleCardSelection;

// ゲーム開始
initGame();// カードデータ（外部JSONファイルから読み込み予定）
let CARDS = [
    {
        id: 1,
        name: "IF文",
        type: "条件",
        effect: "次の攻撃カードのダメージが2倍になる",
        action: "condition",
        value: "double_damage",
        isSpecial: true,
        description: "条件分岐の基本。プログラムの流れを制御する重要な構文。"
    },
    {
        id: 2,
        name: "FORループ",
        type: "攻撃",
        effect: "1～3回ランダムに攻撃（1回あたり8ダメージ）",
        action: "attack",
        value: "random_multi",
        isSpecial: false,
        description: "繰り返し処理の代表格。決まった回数だけ処理を実行する。"
    },
    {
        id: 3,
        name: "無限ループ",
        type: "デバフ",
        effect: "自分の次のターンをスキップする",
        action: "debuff",
        value: "skip_turn",
        isSpecial: false,
        description: "プログラムが止まらなくなる恐怖のバグ。CPUを独占してしまう。"
    },
    {
        id: 4,
        name: "セキュリティパッチ",
        type: "防御",
        effect: "自分の防御レベル +2、次のAI攻撃を無効化",
        action: "security_defense",
        value: 2,
        isSpecial: false,
        description: "脆弱性を修正するアップデート。定期的な適用が重要。"
    },
    {
        id: 5,
        name: "バグ注入",
        type: "妨害",
        effect: "相手に10ダメージ + 防御レベル-1",
        action: "security_attack",
        value: "damage_debuff",
        isSpecial: false,
        description: "意図的にバグを仕込む攻撃手法。システムの不安定化を狙う。"
    },
    {
        id: 6,
        name: "関数展開",
        type: "コンボ",
        effect: "直前に使用したカードの効果を再発動",
        action: "combo",
        value: "repeat_last",
        isSpecial: true,
        description: "関数の処理を展開して再利用。効率的なプログラミング手法。"
    },
    {
        id: 7,
        name: "配列操作",
        type: "攻撃",
        effect: "15ダメージを与える基本攻撃",
        action: "attack",
        value: 15,
        isSpecial: false,
        description: "データを配列で管理し、効率的に処理する基本技術。"
    },
    {
        id: 8,
        name: "例外処理",
        type: "回復",
        effect: "HPを10回復する",
        action: "heal",
        value: 10,
        isSpecial: false,
        description: "エラーに対する適切な処理。プログラムの安定性を保つ。"
    },
    {
        id: 9,
        name: "リファクタリング",
        type: "特殊",
        effect: "手札を3枚ドローする",
        action: "draw",
        value: 3,
        isSpecial: true,
        description: "コードの動作を変えずに構造を改善する技術。保守性向上。"
    },
    {
        id: 10,
        name: "ファイアウォール",
        type: "防御",
        effect: "防御レベル +3（このターン攻撃不可）",
        action: "firewall",
        value: 3,
        isSpecial: false,
        description: "ネットワークを保護する防火壁。不正アクセスを遮断する。"
    },
    {
        id: 11,
        name: "暗号化",
        type: "防御",
        effect: "防御レベル +1、HP +5回復",
        action: "security_heal",
        value: 1,
        isSpecial: false,
        description: "データを暗号化して保護。機密情報の漏洩を防ぐ。"
    },
    {
        id: 12,
        name: "DDoS攻撃",
        type: "妨害",
        effect: "相手の防御レベル -2、8ダメージ",
        action: "security_disruption",
        value: 2,
        isSpecial: false,
        description: "大量のリクエストでサーバーを麻痺させる攻撃手法。"
    },
    {
        id: 16,
        name: "情報漏洩",
        type: "妨害",
        effect: "相手の手札を1枚見て選んで破棄、さらに5ダメージ",
        action: "leak",
        value: 5,
        isSpecial: true,
        description: "セキュリティ意識の低下は大損害に。意図的または過失による情報流出を模擬。"
    },
    {
        id: 17,
        name: "フィッシング詐欺",
        type: "妨害",
        effect: "相手の次のターン、ドローできなくなる（メールに騙された！）",
        action: "phishing",
        value: null,
        isSpecial: false,
        description: "大学でも多発。信頼を装った偽メールに注意。"
    },
    {
        id: 18,
        name: "デジタルデトックス",
        type: "回復",
        effect: "HP10回復 + 状態異常を1つ解除",
        action: "detox",
        value: 10,
        isSpecial: true,
        description: "スマホ依存から解放され、集中力回復！"
    },
    {
        id: 19,
        name: "ジェンダー配慮コード",
        type: "特殊",
        effect: "自分の次の「コンボ系」カードが無条件で成功",
        action: "inclusive_code",
        value: null,
        isSpecial: true,
        description: "多様性を考慮した設計は、全体の生産性を高める。"
    },
    {
        id: 20,
        name: "ディープフェイク対策",
        type: "防御",
        effect: "相手の特殊カード効果を1回無効化",
        action: "deepfake_block",
        value: 1,
        isSpecial: true,
        description: "現代社会で重要なフェイクコンテンツの識別能力。"
    },
    {
        id: 21,
        name: "ブラックボックステスト",
        type: "攻撃",
        effect: "相手のランダムな効果を封じる（効果不発）＋8ダメージ",
        action: "blackbox_test",
        value: 8,
        isSpecial: false,
        description: "内部構造を知らずに挙動を試験するソフトウェアテスト技法。"
    },
    {
        id: 22,
        name: "ゼロトラスト認証",
        type: "防御",
        effect: "次のターン中、すべての攻撃を1回だけ無効化",
        action: "zero_trust",
        value: 1,
        isSpecial: true,
        description: "誰も信用しないセキュリティ原則。大学Wi-Fiでも注目の仕組み。"
    }
];