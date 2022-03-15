use anchor_lang::prelude::*;

declare_id!("HC4NZEsuGoVvbxBypDFjuFLRakQussGc5mfh9cGNHDgY");

const MAX_TOPIC_LENGTH: usize = 50 * 4; // 50 characters max
const MAX_CONTENT_LENGTH: usize = 280 * 4; // 280 characters max

#[program]
pub mod twitter {
    use super::*;

    pub fn send_tweet(ctx: Context<SendTweet>, topic: String, content: String) -> Result<()> {
        if topic.chars().count() > MAX_TOPIC_LENGTH {
            return Err(error!(ErrorCode::TopicTooLong));
        }
        if content.chars().count() > MAX_CONTENT_LENGTH {
            return Err(error!(ErrorCode::ContentTooLong));
        }

        let tweet = &mut ctx.accounts.tweet;
        let author = &ctx.accounts.user;
        let clock = Clock::get().unwrap();
        
        tweet.topic = topic;
        tweet.content = content;
        tweet.author = *author.key;
        tweet.timestamp = clock.unix_timestamp;

        Ok(())
    }


    pub fn update_tweet(ctx: Context<UpdateTweet>, topic: String, content: String) -> Result<()> {
        if topic.chars().count() > MAX_TOPIC_LENGTH {
            return Err(error!(ErrorCode::TopicTooLong));
        }
        if content.chars().count() > MAX_CONTENT_LENGTH {
            return Err(error!(ErrorCode::ContentTooLong));
        }

        let tweet = &mut ctx.accounts.tweet;
        tweet.topic = topic;
        tweet.content = content;

        Ok(())
    }

    pub fn delete_tweet(_ctx: Context<DeleteTweet>) -> Result<()> {
        Ok(())
    }
    
}

#[derive(Accounts)]
pub struct SendTweet<'info> {
    #[account(init, payer=user, space=Tweet::LEN)]
    pub tweet: Account<'info, Tweet>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTweet<'info> {
    #[account(mut, has_one=author)]  // has_one=author => tweet.author == UpdateTweet.author.key
    pub tweet: Account<'info, Tweet>,
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteTweet<'info> {
    #[account(mut, has_one=author, close=author)]
    pub tweet: Account<'info, Tweet>,
    pub author: Signer<'info>,
}

#[account]
pub struct Tweet {
    topic: String,
    content: String,
    author: Pubkey,
    timestamp: i64,
}
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; // stores the size of string
impl Tweet {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH
        + TIMESTAMP_LENGTH 
        + STRING_LENGTH_PREFIX + MAX_TOPIC_LENGTH 
        + STRING_LENGTH_PREFIX + MAX_CONTENT_LENGTH;
}


#[error_code]
pub enum ErrorCode {
    #[msg("Topic length should not be more than 50")]
    TopicTooLong,
    #[msg("Content length should not be more than 280")]
    ContentTooLong,
}