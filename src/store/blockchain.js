export const SET_BLOCK_HEIGHT = 'BLOCKCHAIN/SET_BLOCK_HEIGHT';
export const SET_BLOCKS = 'BLOCKCHAIN/SET_BLOCKS';
export const SELECT_BLOCK = 'BLOCKCHAIN/SELECT_BLOCK';

export function populateChain() {
  return async (dispatch, getState) => {
    const res = await requestJson('blockheight');
    const blockHeight = Number(res.height);
    const shownHeight = getState().blockHeight;
    if (shownHeight === blockHeight) {
      setTimeout(() => dispatch(populateChain()), 5000);
      return;
    }

    dispatch({
      type: SET_BLOCK_HEIGHT,
      payload: {
        blockHeight
      }
    });

    let start;

    if (shownHeight) {
      start = blockHeight - (blockHeight - shownHeight);
    } else {
      start = blockHeight > 10 ? blockHeight - 10 : 0
    }

    const blocks = [];
    for (let i = blockHeight; i > start; i--) {
      const blockRes = await requestJson(`block/${i}`);
      const block = blockRes.block;
      block.hash = toHex(block.hash);
      block.header.merkleRoot = toHex(block.header.merkleRoot);
      block.header.rlpMerkleRoot = toHex(block.header.rlpMerkleRoot);
      block.header.prevHash = toHex(block.header.prevHash);
      block.rootSig = toHex(block.RootSig);
      delete block.RootSig;

      if (!blockRes.transactions || !blockRes.transactions.length) {
        continue;
      }
      
      blockRes.transactions = blockRes.transactions.map((b) => {
        b.rootSig = toHex(b.RootSig);
        delete b.RootSig;

        if (b.sig0) {
          b.sig0 = toHex(b.sig0);
        }

        if (b.sig1) {
          b.sig1 = toHex(b.sig1);
        }

        if (b.output0) {
          b.output0.newOwner = toHex(b.output0.newOwner);
          b.output0.amount = deserBN(b.output0.amount);
        }

        if (b.output1) {
          b.output1.newOwner = toHex(b.output1.newOwner);
          b.output1.amount = deserBN(b.output1.amount);
        }

        return b;
      });

      blocks.push({
        hash: block.hash,
        rootSig: block.rootSig,
        header: block.header,
        transactions: blockRes.transactions
      })
    }

    dispatch({
      type: SET_BLOCKS,
      payload: {
        blocks
      }
    });

    setTimeout(() => dispatch(populateChain()), 1000);
  }
}

function requestJson(path) {
  return fetch(`https://plasma-rinkeby.dev.kyokan.io/v1/${path}`, {
    method: 'GET',
    mode: 'cors'
  })
    .then((res) => {
      if (res.status < 200 || res.status > 300) {
        throw new Error('request failed');
      }

      return res
    }).then((res) => res.json())
}

function toHex(base64, prefix = true) {
  if (!base64) {
    return '';
  }

  const res = window.atob(base64).split('')
    .map(mapper)
    .join('')
    .toLowerCase(); // Per your example output

  if (prefix) {
    return '0x' + res;
  }

  return res;
}

export function selectBlock(id) {
  return {
    type: SELECT_BLOCK,
    payload: {
      selectedBlock: id
    }
  };
}

function mapper(char) {
  return ('0' + char.charCodeAt(0).toString(16)).slice(-2);
}

function getInitialState() {
  return {
    blockHeight: 0,
    selectedBlock: null,
    fetching: true,
    failed: false,
    blockCache: {},
    blocks: []
  }
}

function deserBN(bn) {
  if (!bn.values) {
    return '0';
  }

  return window.atob(bn.values);
}

function setBlockHeight(state, action) {
  return {
    ...state,
    blockHeight: action.payload.blockHeight
  };
}

function setBlocks(state, action) {
  return {
    ...state,
    selectedBlock: state.selectedBlock ? state.selectedBlock :
      action.payload.blocks[0].header.number,
    blocks: [].concat(action.payload.blocks).concat(state.blocks),
    blockCache: action.payload.blocks.reduce((acc, curr) => {
      acc[curr.header.number] = curr;
      return acc
    }, { ...state.blockCache })
  }
}

function reduceSelectBlock(state, action) {
  return {
    ...state,
    selectedBlock: action.payload.selectedBlock
  }
}

export default function (state, action) {
  switch (action.type) {
    case SET_BLOCK_HEIGHT:
      return setBlockHeight(state, action);
    case SET_BLOCKS:
      return setBlocks(state, action);
    case SELECT_BLOCK:
      return reduceSelectBlock(state, action);
    default:
      return getInitialState();
  }
}